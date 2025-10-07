from fastapi import APIRouter, HTTPException, status
from sqlmodel import Session, select
from .models import User
from .schemas import UserCreate, Token
from .db import engine
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta

SECRET = 'CHANGE_ME_TO_A_RANDOM_SECRET'
ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 60*24*7

# Используем более стабильную версию контекста
pwd_context = CryptContext(schemes=["bcrypt"], bcrypt__rounds=12, deprecated="auto")
router = APIRouter()

def get_password_hash(password: str):
    # Ограничиваем длину пароля для bcrypt
    if len(password) > 72:
        password = password[:72]
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(*, data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({'exp': expire})
    return jwt.encode(to_encode, SECRET, algorithm=ALGORITHM)

@router.post('/register', response_model=Token)
def register(user: UserCreate):
    with Session(engine) as session:
        # Проверяем существование пользователя
        statement = select(User).where(User.username == user.username)
        existing_user = session.exec(statement).first()
        if existing_user:
            raise HTTPException(status_code=400, detail='Username already exists')
        
        # Создаем пользователя
        db_user = User(
            username=user.username, 
            hashed_password=get_password_hash(user.password), 
            full_name=user.full_name
        )
        session.add(db_user)
        session.commit()
        session.refresh(db_user)
        
        # Создаем токен
        access_token = create_access_token(
            data={'sub': db_user.username}, 
            expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        return {'access_token': access_token, 'token_type': 'bearer'}

@router.post('/login', response_model=Token)
def login(form_data: UserCreate):
    with Session(engine) as session:
        statement = select(User).where(User.username == form_data.username)
        user = session.exec(statement).first()
        if not user or not verify_password(form_data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail='Invalid username or password'
            )
        token = create_access_token(
            data={'sub': user.username}, 
            expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        return {'access_token': token, 'token_type': 'bearer'}