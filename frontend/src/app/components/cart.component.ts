import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  items: any[] = [];
  
  get subtotal() {
    return this.cart.total();
  }
  
  get delivery() {
    return this.subtotal > 0 ? 500 : 0;
  }
  
  get discount() {
    return this.subtotal > 50000 ? 2500 : 0;
  }
  
  get total() {
    return this.subtotal + this.delivery - this.discount;
  }
  
  get totalItems() {
    return this.cart.getCount();
  }

  constructor(
    public cart: CartService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cart.cart$.subscribe(items => {
      this.items = items;
      console.log('Корзина обновлена:', this.items);
    });
  }

  updateQty(item: any, newQty: number) {
    this.cart.updateQty(item.id, newQty);
  }

  remove(id: any): void {
    this.cart.remove(id);
  }

  // Новый метод для перехода к оформлению заказа
  goToCheckout(): void {
    if (this.items.length === 0) {
      alert('Корзина пуста!');
      return;
    }
    this.router.navigate(['/checkout']);
  }

  continueShopping(): void {
    this.router.navigate(['/']);
  }
}