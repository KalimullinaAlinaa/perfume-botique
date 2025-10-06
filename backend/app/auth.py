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

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
router = APIRouter()

def get_password_hash(password: str):
    return pwd_context.hash(password)

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def create_access_token(*, data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({'exp': expire})
    return jwt.encode(to_encode, SECRET, algorithm=ALGORITHM)

@router.post('/register', response_model=dict)
def register(user: UserCreate):
    with Session(engine) as session:
        statement = select(User).where(User.username == user.username)
        results = session.exec(statement).first()
        if results:
            raise HTTPException(status_code=400, detail='Username exists')
        db_user = User(username=user.username, hashed_password=get_password_hash(user.password), full_name=user.full_name)
        session.add(db_user)
        session.commit()
        session.refresh(db_user)
        access_token = create_access_token(data={'sub': db_user.username}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
        return {'access_token': access_token, 'token_type': 'bearer'}

@router.post('/login', response_model=Token)
def login(form_data: UserCreate):
    with Session(engine) as session:
        statement = select(User).where(User.username == form_data.username)
        user = session.exec(statement).first()
        if not user or not verify_password(form_data.password, user.hashed_password):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid credentials')
        token = create_access_token(data={'sub': user.username}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
        return {'access_token': token, 'token_type': 'bearer'}
