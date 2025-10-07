import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  @ViewChild('firstNameInput') firstNameInput!: ElementRef;
  @ViewChild('lastNameInput') lastNameInput!: ElementRef;
  @ViewChild('emailInput') emailInput!: ElementRef;
  @ViewChild('phoneInput') phoneInput!: ElementRef;
  @ViewChild('addressInput') addressInput!: ElementRef;
  @ViewChild('cityInput') cityInput!: ElementRef;
  @ViewChild('postalCodeInput') postalCodeInput!: ElementRef;
  @ViewChild('commentInput') commentInput!: ElementRef;

  items: any[] = [];
  total = 0;

  constructor(
    private cartService: CartService, 
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.items = this.cartService.getItems();
    this.total = this.cartService.total();
    
    if (this.items.length === 0) {
      this.router.navigate(['/']);
      alert('Корзина пуста! Добавьте товары перед оформлением заказа.');
    }
  }

  submitOrder(): void {
    console.log('📦 Начало оформления заказа');
    
    // Получаем значения из инпутов
    const formData = {
      firstName: this.firstNameInput.nativeElement.value,
      lastName: this.lastNameInput.nativeElement.value,
      email: this.emailInput.nativeElement.value,
      phone: this.phoneInput.nativeElement.value,
      address: this.addressInput.nativeElement.value,
      city: this.cityInput.nativeElement.value,
      postalCode: this.postalCodeInput.nativeElement.value,
      comment: this.commentInput.nativeElement.value
    };

    console.log('📦 Данные заказа:', formData);

    // Проверяем обязательные поля
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.address || !formData.city) {
      alert('❌ Пожалуйста, заполните все обязательные поля (отмечены *)');
      return;
    }

    const orderData = {
      customer_name: `${formData.firstName} ${formData.lastName}`,
      customer_email: formData.email,
      customer_phone: formData.phone,
      customer_address: `${formData.city}, ${formData.address}${formData.postalCode ? ', ' + formData.postalCode : ''}`,
      items: this.items.map(item => ({
        product_id: item.id,
        quantity: item.qty,
        price: item.price
      }))
    };

    console.log('🚀 Отправка заказа на сервер:', orderData);

    this.http.post('http://localhost:8000/api/orders', orderData).subscribe({
      next: (response: any) => {
        console.log('✅ Заказ создан:', response);
        alert('🎉 Заказ успешно оформлен! Спасибо за покупку! 🎀');
        this.cartService.clear();
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('❌ Ошибка оформления заказа:', error);
        if (error.status === 0) {
          alert('❌ Сервер недоступен. Проверьте, запущен ли бэкенд.');
        } else {
          alert('❌ Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте еще раз.');
        }
      }
    });
  }
}