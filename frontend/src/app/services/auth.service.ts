import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

interface User {
  username: string;
  fullName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8000/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromToken());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { username, password }).pipe(
      tap((response: any) => {
        if (response.access_token) {
          this.setToken(response.access_token);
          this.currentUserSubject.next(this.getUserFromToken());
        }
      })
    );
  }

  register(username: string, password: string, full_name: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, { username, password, full_name }).pipe(
      tap((response: any) => {
        if (response.access_token) {
          this.setToken(response.access_token);
          this.currentUserSubject.next(this.getUserFromToken());
        }
      })
    );
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/me`);
  }

  // Сохраняем токен
  private setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Получаем токен
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Выход
  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  // Проверяем, авторизован ли пользователь
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      return decoded.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  // Получаем информацию о пользователе из токена
  private getUserFromToken(): User | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      return {
        username: decoded.sub,
        fullName: decoded.full_name
      };
    } catch {
      return null;
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}