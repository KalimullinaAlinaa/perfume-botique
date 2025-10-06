from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    password: str
    full_name: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class ProductCreate(BaseModel):
    title: str
    description: Optional[str] = None
    price: float
    image_url: Optional[str] = None

class ProductRead(ProductCreate):
    id: int

# Схемы для заказов
class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int
    price: float

class OrderItemRead(BaseModel):
    id: int
    product_id: int
    quantity: int
    price: float
    product: ProductRead

class OrderCreate(BaseModel):
    customer_name: str
    customer_email: str
    customer_phone: str
    customer_address: str
    items: List[OrderItemCreate]

class OrderRead(BaseModel):
    id: int
    total: float
    status: str
    customer_name: str
    customer_email: str
    customer_phone: str
    customer_address: str
    created_at: datetime
    order_items: List[OrderItemRead]