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
  isSubmitting = false;

  // Данные для автозаполнения
  customerData: any = null;

  constructor(
    private cartService: CartService, 
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.items = this.cartService.getItems();
    this.total = this.cartService.total();
    
    // Загружаем сохраненные данные пользователя
    this.loadCustomerData();
    
    if (this.items.length === 0) {
      this.router.navigate(['/']);
      alert('Корзина пуста! Добавьте товары перед оформлением заказа.');
    }

    console.log('✅ CheckoutComponent инициализирован');
  }

  // Загружаем сохраненные данные пользователя
  loadCustomerData(): void {
    const savedData = localStorage.getItem('customerData');
    if (savedData) {
      this.customerData = JSON.parse(savedData);
      console.log('📋 Загружены данные пользователя:', this.customerData);
      
      // Автозаполняем форму после загрузки представления
      setTimeout(() => {
        this.autofillForm();
      }, 100);
    }
  }

  // Автозаполнение формы
  autofillForm(): void {
    if (this.customerData) {
      try {
        // Разбиваем полное имя на имя и фамилию
        const nameParts = this.customerData.name.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        if (this.firstNameInput?.nativeElement) {
          this.firstNameInput.nativeElement.value = firstName;
        }
        if (this.lastNameInput?.nativeElement) {
          this.lastNameInput.nativeElement.value = lastName;
        }
        if (this.emailInput?.nativeElement) {
          this.emailInput.nativeElement.value = this.customerData.email || '';
        }
        if (this.phoneInput?.nativeElement) {
          this.phoneInput.nativeElement.value = this.customerData.phone || '';
        }
        
        // Разбиваем адрес на город и адрес
        const addressParts = (this.customerData.address || '').split(',');
        const city = addressParts[0]?.trim() || '';
        const address = addressParts.slice(1).join(',').trim() || '';

        if (this.cityInput?.nativeElement) {
          this.cityInput.nativeElement.value = city;
        }
        if (this.addressInput?.nativeElement) {
          this.addressInput.nativeElement.value = address;
        }
        if (this.postalCodeInput?.nativeElement && this.customerData.postalCode) {
          this.postalCodeInput.nativeElement.value = this.customerData.postalCode;
        }

        console.log('✅ Форма автозаполнена');
      } catch (error) {
        console.error('❌ Ошибка автозаполнения:', error);
      }
    }
  }

  submitOrder(): void {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    console.log(' Метод submitOrder вызван!');
    
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

    console.log('📝 Данные формы:', formData);

    // Проверяем обязательные поля
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.address || !formData.city) {
      alert('❌ Пожалуйста, заполните все обязательные поля (отмечены *)');
      this.isSubmitting = false;
      return;
    }

    // Сохраняем данные покупателя в localStorage ДО отправки заказа
    this.saveCustomerData(formData);

    const orderData = {
      customer_name: `${formData.firstName} ${formData.lastName}`,
      customer_email: formData.email,
      customer_phone: formData.phone,
      customer_address: `${formData.city}, ${formData.address}`,
      comment: formData.comment,
      total_amount: this.total + 500,
      items: this.items.map(item => ({
        product_id: item.id,
        product_title: item.name || item.title,
        quantity: item.qty,
        price: item.price
      }))
    };

    console.log('🚀 Отправка заказа на сервер:', orderData);

    this.http.post('http://localhost:8000/api/orders', orderData).subscribe({
      next: (response: any) => {
        console.log('✅ Заказ создан:', response);
        
        // Сохраняем заказ в историю
        this.saveOrderToHistory(orderData, response.id || response.order_id);
        
        alert('🎉 Заказ успешно оформлен! Спасибо за покупку! 🎀');
        this.cartService.clear();
        this.isSubmitting = false;
        this.router.navigate(['/account']);
      },
      error: (error) => {
        console.error('❌ Ошибка оформления заказа:', error);
        this.isSubmitting = false;
        if (error.status === 0) {
          alert('❌ Сервер недоступен. Проверьте, запущен ли бэкенд.');
        } else {
          // Если сервер недоступен, сохраняем заказ локально
          this.saveOrderToHistory(orderData, Date.now().toString());
          alert('⚠️ Сервер временно недоступен. Заказ сохранен локально и будет обработан позже.');
          this.cartService.clear();
          this.router.navigate(['/account']);
        }
      }
    });
  }

  // Сохраняем данные пользователя
  private saveCustomerData(formData: any): void {
    const customerData = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      address: `${formData.city}, ${formData.address}`,
      postalCode: formData.postalCode
    };
    
    localStorage.setItem('customerData', JSON.stringify(customerData));
    console.log('💾 Данные пользователя сохранены:', customerData);
  }

  private saveOrderToHistory(orderData: any, orderId: string): void {
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    const newOrder = {
      id: orderId || Date.now().toString(),
      date: new Date().toISOString(),
      status: 'pending',
      items: orderData.items,
      total: orderData.total_amount,
      customer: {
        name: orderData.customer_name,
        email: orderData.customer_email,
        phone: orderData.customer_phone,
        address: orderData.customer_address
      },
      comment: orderData.comment
    };
    
    orderHistory.unshift(newOrder);
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
    console.log('💾 Заказ сохранен в историю:', newOrder);
  }

  // Очистка сохраненных данных
  clearCustomerData(): void {
    localStorage.removeItem('customerData');
    this.customerData = null;
    
    // Очищаем форму
    if (this.firstNameInput?.nativeElement) this.firstNameInput.nativeElement.value = '';
    if (this.lastNameInput?.nativeElement) this.lastNameInput.nativeElement.value = '';
    if (this.emailInput?.nativeElement) this.emailInput.nativeElement.value = '';
    if (this.phoneInput?.nativeElement) this.phoneInput.nativeElement.value = '';
    if (this.addressInput?.nativeElement) this.addressInput.nativeElement.value = '';
    if (this.cityInput?.nativeElement) this.cityInput.nativeElement.value = '';
    if (this.postalCodeInput?.nativeElement) this.postalCodeInput.nativeElement.value = '';
    if (this.commentInput?.nativeElement) this.commentInput.nativeElement.value = '';
    
    alert('🧹 Данные формы очищены');
  }
}