import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface Product {
  id?: string;
  name: string;
  description?: string;
  price?: number;
  image?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = environment.apiUrl; // http://localhost:8000/api
  private authUrl = environment.apiUrl.replace('/api', ''); // http://localhost:8000

  constructor(private http: HttpClient) {}

  // Продукты
  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  list(search?: string): Observable<Product[]> {
    const url = search ? `${this.apiUrl}/products?q=${encodeURIComponent(search)}` : `${this.apiUrl}/products`;
    return this.http.get<Product[]>(url);
  }

  get(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  // Аутентификация - используем authUrl без /api
  register(username: string, password: string, full?: string) {
    return this.http.post(`${this.authUrl}/auth/register`, { 
      username, 
      password, 
      full_name: full 
    });
  }

  login(username: string, password: string) {
    return this.http.post(`${this.authUrl}/auth/login`, { 
      username, 
      password 
    });
  }
}