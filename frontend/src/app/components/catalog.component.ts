import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  searchQuery: string = '';
  selectedCategory: string = 'all';
  isLoading: boolean = true;

  constructor(
    private http: HttpClient,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.http.get('http://localhost:8000/api/products').subscribe({
      next: (data: any) => {
        this.products = data;
        this.filteredProducts = data;
        this.isLoading = false;
        console.log('✅ Товары загружены:', this.products);
      },
      error: (error) => {
        console.error('❌ Ошибка загрузки товаров:', error);
        // Заглушка для демонстрации
        this.products = [
          { 
            id: 1, 
            name: 'Chanel №5', 
            price: 4500, 
            category: 'women',
            description: 'Классический женский аромат с нотами иланг-иланга и ванили',
            image: 'assets/images/chanel-no5.jpg'
          },
          { 
            id: 2, 
            name: 'Dior Sauvage', 
            price: 5200, 
            category: 'men',
            description: 'Смелый мужской парфюм с аккордами перца и амбры',
            image: 'assets/images/dior-sauvage.jpg'
          },
          { 
            id: 3, 
            name: 'Gucci Bloom', 
            price: 4800, 
            category: 'women',
            description: 'Цветочный женский аромат с нотами жасмина и туберозы',
            image: 'assets/images/gucci-bloom.jpg'
          },
          { 
            id: 4, 
            name: 'Bleu de Chanel', 
            price: 5500, 
            category: 'men',
            description: 'Утонченный мужской парфюм с цитрусовыми нотами',
            image: 'assets/images/bleu-de-chanel.jpg'
          },
          { 
            id: 5, 
            name: 'J\'adore Dior', 
            price: 4900, 
            category: 'women',
            description: 'Роскошный женский аромат с цветочными аккордами',
            image: 'assets/images/jadore-dior.jpg'
          },
          { 
            id: 6, 
            name: 'Armani Code', 
            price: 4700, 
            category: 'men',
            description: 'Элегантный мужской парфюм с нотами лимона и табака',
            image: 'assets/images/armani-code.jpg'
          }
        ];
        this.filteredProducts = this.products;
        this.isLoading = false;
      }
    });
  }

  addToCart(product: any): void {
    this.cartService.addToCart(product);
    alert(`🎉 Товар "${product.name}" добавлен в корзину!`);
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesCategory = this.selectedCategory === 'all' || product.category === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }

  onSearchChange(event: any): void {
    this.searchQuery = event.target.value;
    this.filterProducts();
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.filterProducts();
  }

  openProduct(product: any): void {
    console.log('Открыт товар:', product);
  }

  getCategoryName(category: string): string {
    const categoryNames: { [key: string]: string } = {
      'all': 'Все товары',
      'women': 'Женские ароматы',
      'men': 'Мужские ароматы'
    };
    return categoryNames[category] || category;
  }
}