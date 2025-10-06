from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Session, select
from .db import engine
from . import auth, crud, models

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
            # Добавляем парфюмы вместо одежды
            perfumes = [
                models.Product(
                    title='Chanel Coco Mademoiselle', 
                    description='Изысканный цветочный аромат с нотами бергамота и жасмина', 
                    price=25990.0, 
                    image_url='chanel-coco.jpg'
                ),
                models.Product(
                    title='Miss Dior Blooming Bouquet', 
                    description='Нежный и романтичный аромат с аккордами пиона и розы', 
                    price=29500.0, 
                    image_url='miss-dior.jpg'
                ),
                models.Product(
                    title='Black Opium', 
                    description='Смелый и загадочный аромат с кофе и ванилью', 
                    price=32750.0, 
                    image_url='black-opium.jpg'
                ),
                models.Product(
                    title='J\'adore Dior', 
                    description='Бессмертная классика с нотами иланг-иланга и розы', 
                    price=27800.0, 
                    image_url='jadore.jpg'
                )
            ]
            session.add_all(perfumes)
            session.commit()