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
  private apiUrl = environment.apiUrl;

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
}