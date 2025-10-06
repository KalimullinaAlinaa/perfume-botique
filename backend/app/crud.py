from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select
from .db import engine
from .models import Product, Order, OrderItem
from .schemas import ProductCreate, ProductRead, OrderCreate, OrderRead, OrderItemRead
from typing import List

router = APIRouter()

# Существующие эндпоинты для продуктов
@router.post('/products', response_model=ProductRead)
def create_product(payload: ProductCreate):
    with Session(engine) as session:
        p = Product(**payload.dict())
        session.add(p)
        session.commit()
        session.refresh(p)
        return p

@router.get('/products', response_model=list[ProductRead])
def list_products():
    with Session(engine) as session:
        return session.exec(select(Product)).all()

@router.get('/products/{product_id}', response_model=ProductRead)
def get_product(product_id: int):
    with Session(engine) as session:
        p = session.get(Product, product_id)
        if not p:
            raise HTTPException(status_code=404, detail='Not found')
        return p

# Новые эндпоинты для заказов
@router.post('/orders', response_model=OrderRead)
def create_order(payload: OrderCreate):
    with Session(engine) as session:
        # Проверяем существование продуктов
        for item in payload.items:
            product = session.get(Product, item.product_id)
            if not product:
                raise HTTPException(status_code=404, detail=f'Product {item.product_id} not found')
        
        # Рассчитываем общую сумму
        total = sum(item.price * item.quantity for item in payload.items)
        
        # Создаем заказ
        order = Order(
            customer_name=payload.customer_name,
            customer_email=payload.customer_email,
            customer_phone=payload.customer_phone,
            customer_address=payload.customer_address,
            total=total
        )
        session.add(order)
        session.commit()
        session.refresh(order)
        
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
        
        # Получаем полную информацию о заказе для ответа
        return get_order_with_items(order.id)

@router.get('/orders', response_model=List[OrderRead])
def list_orders():
    with Session(engine) as session:
        orders = session.exec(select(Order)).all()
        return [get_order_with_items(order.id) for order in orders]

@router.get('/orders/{order_id}', response_model=OrderRead)
def get_order(order_id: int):
    return get_order_with_items(order_id)

def get_order_with_items(order_id: int):
    with Session(engine) as session:
        order = session.get(Order, order_id)
        if not order:
            raise HTTPException(status_code=404, detail='Order not found')
        
        # Получаем элементы заказа с информацией о продуктах
        order_items = session.exec(
            select(OrderItem).where(OrderItem.order_id == order_id)
        ).all()
        
        # Создаем ответ с полной информацией
        order_data = OrderRead(
            id=order.id,
            total=order.total,
            status=order.status,
            customer_name=order.customer_name,
            customer_email=order.customer_email,
            customer_phone=order.customer_phone,
            customer_address=order.customer_address,
            created_at=order.created_at,
            order_items=[]
        )
        
        for item in order_items:
            product = session.get(Product, item.product_id)
            order_data.order_items.append(
                OrderItemRead(
                    id=item.id,
                    product_id=item.product_id,
                    quantity=item.quantity,
                    price=item.price,
                    product=ProductRead(
                        id=product.id,
                        title=product.title,
                        description=product.description,
                        price=product.price,
                        image_url=product.image_url
                    )
                )
            )
        
        return order_data