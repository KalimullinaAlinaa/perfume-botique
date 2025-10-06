import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];

  constructor(
    private cartService: CartService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.productService.getAll().subscribe({
      next: (data) => {
        console.log('✅ Получены товары с API:', data);
        this.products = data;
        this.filteredProducts = data;
      },
      error: (err) => console.error('❌ Ошибка загрузки товаров:', err)
    });
  }

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredProducts = this.products.filter(p =>
      (p.title || '').toLowerCase().includes(value)
    );
  }

  addToCart(product: any) {
    console.log('🛒 Добавляем товар в корзину:', product);
    this.cartService.addToCart(product);
    
    // Проверяем состояние корзины
    setTimeout(() => {
      const items = this.cartService.getItems();
      const count = this.cartService.getCount();
      console.log('📦 Текущая корзина:', items);
      console.log('🔢 Количество товаров:', count);
    }, 100);
    
    alert(`${product.title} добавлен в корзину! 🎀`);
  }
}