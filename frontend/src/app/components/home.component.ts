import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from '../services/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  error: string | null = null;

  constructor(private ps: ProductService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const q = params['search'] || '';
      this.load(q);
    });
  }

  load(search = ''): void {
    this.loading = true;
    this.error = null;
    this.ps.list(search).subscribe({
      next: data => {
        this.products = data;
        this.loading = false;
      },
      error: err => {
        this.error = 'Ошибка загрузки';
        this.loading = false;
      }
    });
  }
}
