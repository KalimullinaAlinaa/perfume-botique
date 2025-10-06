import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  products: any[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getAll().subscribe({
      next: (data: any) => this.products = data,
      error: err => console.error('Failed to load products', err)
    });
  }
}
