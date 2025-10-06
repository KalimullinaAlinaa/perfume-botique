import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthDialogComponent } from './auth-dialog.component';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  cartCount = 0;

  constructor(
    public router: Router,
    private dialog: MatDialog,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // Подписываемся на изменения корзины
    this.cartService.cart$.subscribe(() => {
      this.cartCount = this.cartService.getCount();
    });
    
    // Инициализируем начальное значение
    this.cartCount = this.cartService.getCount();
  }

  openAuthDialog(): void {
    this.dialog.open(AuthDialogComponent, {
      width: '400px',
      data: { mode: 'login' }
    });
  }
}