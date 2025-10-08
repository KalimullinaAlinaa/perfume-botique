from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Session, select
from .db import engine
from . import auth, crud, models
import datetime

app = FastAPI(title='Perfume Shop API')

origins = [
    'http://localhost:4200',
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(auth.router, prefix='/auth', tags=['auth'])
app.include_router(crud.router, prefix='/api', tags=['api'])

@app.on_event('startup')
def on_startup():
    # create tables
    SQLModel.metadata.create_all(engine)
    # seed sample products if none exist
    with Session(engine) as session:
        statement = select(models.Product)
        first = session.exec(statement).first()
        if not first:
            # Добавляем парфюмы
            perfumes = [
                models.Product(
                    title='Chanel Coco Mademoiselle', 
                    description='Изысканный цветочный аромат с нотами бергамота и жасмина', 
                    price=7500.0, 
                ),
                models.Product(
                    title='Miss Dior Blooming Bouquet', 
                    description='Нежный и романтичный аромат с аккордами пиона и розы', 
                    price=6800.0, 
                ),
                models.Product(
                    title='Versace Bright Crystal', 
                    description='Бессмертная классика с нотами иланг-иланга и розы', 
                    price=6900.0, 
                ),
                models.Product(
                    title='Berberry HER', 
                    description='Женский, кондитерский парфюм со сладкой ватой', 
                    price=7800.0, 
                ),
                models.Product(
                    title='Prada Flower', 
                    description='Утонченный женский парфюм с цитрусовыми нотами', 
                    price=8200.0, 
                ),
                models.Product(
                    title='Gucci Bloom', 
                    description='Цветочный женский аромат с нотами жасмина и туберозы', 
                    price=6500.0, 
                ),
                models.Product(
                    title='Dior Addict', 
                    description='Элегантный женский парфюм с нотами фруктов и лимона', 
                    price=5800.0, 
                ),
                models.Product(
                    title='La Vie Est Belle Lancôme', 
                    description='Солнечный женский аромат с ирисовыми нотами и карамелью', 
                    price=7100.0, 
                ),
                models.Product(
                    title='Versace Eros', 
                    description='Яркий мужской парфюм с нотами мяты и зеленого яблока', 
                    price=5900.0, 
                    image_url='assets/images/versace-eros.jpg'
                )
            ]
            session.add_all(perfumes)
            session.commit()
            print("бд заполнена")

@app.get("/")
def read_root():
    return {"message": "Welcome to Perfume Boutique API"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "Perfume Boutique API"}