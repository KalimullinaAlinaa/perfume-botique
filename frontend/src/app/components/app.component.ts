import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthDialogComponent } from './auth-dialog.component';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  cartCount = 0;
  currentUser: any = null;

  constructor(
    public router: Router, // Убедись что router публичный
    private dialog: MatDialog,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log('🚀 AppComponent инициализирован');
    
    // Подписка на корзину
    this.cartService.cart$.subscribe((items) => {
      this.cartCount = this.cartService.getCount();
      console.log('🛒 Количество товаров в корзине:', this.cartCount);
    });
    
    // Подписка на изменения пользователя
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      console.log('👤 Текущий пользователь:', user);
    });

    // Инициализируем начальные значения
    this.cartCount = this.cartService.getCount();
    this.currentUser = this.authService.getCurrentUser();
  }

  openAuthDialog(): void {
    console.log('🪟 Открытие диалога авторизации');
    const dialogRef = this.dialog.open(AuthDialogComponent, {
      width: '420px',
      data: { mode: 'login' }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('✅ Авторизация успешна, обновляем пользователя');
        this.currentUser = this.authService.getCurrentUser();
      }
    });
  }

  logout(): void {
    console.log('🚪 Выход из системы');
    this.authService.logout();
    this.currentUser = null;
    alert('Вы вышли из системы');
  }
}