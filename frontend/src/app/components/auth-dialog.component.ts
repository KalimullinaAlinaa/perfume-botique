import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.css']
})
export class AuthDialogComponent {
  username = '';
  password = '';
  full = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AuthDialogComponent>,
    private ps: ProductService,
    private router: Router
  ) {}

  toggleMode(): void {
    this.data.mode = this.data.mode === 'register' ? 'login' : 'register';
    // Очищаем поля при переключении
    this.username = '';
    this.password = '';
    this.full = '';
  }

  submit(): void {
    if (this.data.mode === 'register') {
      this.ps.register(this.username, this.password, this.full).subscribe({
        next: () => {
          alert('🎀 Регистрация успешна! Добро пожаловать!');
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Ошибка регистрации:', error);
          if (error.status === 400) {
            alert('❌ Пользователь с таким именем уже существует');
          } else {
            alert('❌ Ошибка регистрации. Попробуйте еще раз.');
          }
        }
      });
    } else {
      this.ps.login(this.username, this.password).subscribe({
        next: (response: any) => {
          console.log('Вход успешен:', response);
          alert('🎀 Вход успешен! Рады видеть вас снова!');
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Ошибка входа:', error);
          if (error.status === 401) {
            alert('❌ Неверное имя пользователя или пароль');
          } else {
            alert('❌ Ошибка входа. Проверьте данные и попробуйте еще раз.');
          }
        }
      });
    }
  }
}