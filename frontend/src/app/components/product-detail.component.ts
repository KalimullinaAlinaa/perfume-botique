import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: any = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private ps: ProductService,
    private cart: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    if (id) this.load(id);
  }

  load(id: string) {
    this.loading = true;
    this.ps.get(String(id)).subscribe({
      next: p => { this.product = p; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  addToCart() {
    if (this.product) {
      this.cart.add(this.product);
      this.router.navigate(['/cart']);
    }
  }
}
