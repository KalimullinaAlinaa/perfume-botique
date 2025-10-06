import { Component } from '@angular/core';

@Component({
  selector: 'app-cart',
  template: `
    <div class="cart-page">
      <h2>🛒 Ваша корзина</h2>
      <p *ngIf="cart.length === 0">Корзина пуста</p>
      <mat-card *ngFor="let item of cart" class="cart-item">
        <img [src]="item.image" alt="{{ item.name }}">
        <div class="info">
          <h3>{{ item.name }}</h3>
          <p>{{ item.price }} ₸</p>
        </div>
        <button mat-stroked-button color="warn" (click)="remove(item)">Удалить</button>
      </mat-card>
    </div>
  `,
  styles: [`
    .cart-page { padding: 2rem; }
    .cart-item {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
      padding: 1rem;
    }
    img {
      width: 100px;
      height: 100px;
      border-radius: 8px;
      margin-right: 1rem;
      object-fit: cover;
    }
    .info { flex: 1; }
  `]
})
export class CartComponent {
  cart = [
    { name: 'Футболка Oversize', price: 4990, image: 'assets/products/tshirt.jpg' }
  ];

  remove(item: any) {
    this.cart = this.cart.filter(i => i !== item);
  }
}
