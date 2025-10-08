from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select
from .db import engine
from .models import Product, Order, OrderItem
from .schemas import ProductCreate, ProductRead, OrderCreate, OrderRead, OrderItemRead
from typing import List
import datetime

router = APIRouter()

# Эндпоинты для продуктов
@router.post('/products', response_model=ProductRead)
def create_product(payload: ProductCreate):
    with Session(engine) as session:
        p = Product(**payload.dict())
        session.add(p)
        session.commit()
        session.refresh(p)
        return p

@router.get('/products', response_model=List[ProductRead])
def list_products():
    with Session(engine) as session:
        # Используем session.exec для SQLModel
        statement = select(Product)
        products = session.exec(statement).all()
        return products

@router.get('/products/{product_id}', response_model=ProductRead)
def get_product(product_id: int):
    with Session(engine) as session:
        p = session.get(Product, product_id)
        if not p:
            raise HTTPException(status_code=404, detail='Product not found')
        return p

# Эндпоинты для заказов
@router.post('/orders', response_model=OrderRead)
def create_order(payload: OrderCreate):

    
    with Session(engine) as session:
        try:
            # Рассчитываем общую сумму
            total = sum(item.price * item.quantity for item in payload.items)
            print(f"Общая сумма: {total}")
            
            # Создаем заказ
            order = Order(
                customer_name=payload.customer_name,
                customer_email=payload.customer_email,
                customer_phone=payload.customer_phone,
                customer_address=payload.customer_address,
                total=total,
                created_at=datetime.datetime.utcnow()
            )
            session.add(order)
            session.commit()
            session.refresh(order)
            print(f"Заказ создан с ID: {order.id}")
            
            # Создаем элементы заказа
            for item in payload.items:
                order_item = OrderItem(
                    order_id=order.id,
                    product_id=item.product_id,
                    quantity=item.quantity,
                    price=item.price
                )
                session.add(order_item)
            
            session.commit()
            print("Элементы заказа сохранены")
            
            # Возвращаем ответ
            return OrderRead(
                id=order.id,
                customer_name=order.customer_name,
                customer_email=order.customer_email,
                customer_phone=order.customer_phone,
                customer_address=order.customer_address,
                total=order.total,
                status=order.status,
                created_at=order.created_at,
                order_items=[
                    OrderItemRead(
                        id=idx + 1,
                        product_id=item.product_id,
                        quantity=item.quantity,
                        price=item.price,
                        product=ProductRead(
                            id=item.product_id,
                            title=f"Товар {item.product_id}",
                            description="Описание товара",
                            price=item.price,
                            image_url=None
                        )
                    ) for idx, item in enumerate(payload.items)
                ]
            )
            
        except Exception as e:
            print(f"❌ Ошибка: {e}")
            session.rollback()
            raise HTTPException(status_code=500, detail=f"Ошибка создания заказа: {str(e)}")

@router.get('/orders', response_model=List[OrderRead])
def list_orders():
    with Session(engine) as session:
        statement = select(Order)
        orders = session.exec(statement).all()
        return orders

@router.get('/orders/{order_id}', response_model=OrderRead)
def get_order(order_id: int):
    with Session(engine) as session:
        order = session.get(Order, order_id)
        if not order:
            raise HTTPException(status_code=404, detail='Order not found')
        return order