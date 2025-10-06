import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
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
    
    // Если корзина пуста, перенаправляем на главную
    if (this.items.length === 0) {
      this.router.navigate(['/']);
    }
  }

  submitOrder(formData: any) {
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

    this.http.post('http://localhost:8000/api/orders', orderData).subscribe({
      next: (response: any) => {
        console.log('✅ Заказ создан:', response);
        alert('✅ Заказ успешно оформлен! Спасибо за покупку! 🎀');
        this.cartService.clear();
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('❌ Ошибка оформления заказа:', error);
        alert('❌ Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте еще раз.');
      }
    });
  }
}