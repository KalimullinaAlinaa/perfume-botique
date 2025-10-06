import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const API = 'http://localhost:8000';

@Injectable({ providedIn: 'root' })
export class ApiService {
  token: string | null = localStorage.getItem('token');
  constructor(private http: HttpClient) {}

  setToken(t: string) { this.token = t; localStorage.setItem('token', t); this.token = t; }

  private headers() {
    return this.token ? { headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` }) } : {};
  }

  register(username: string, password: string, full_name?: string) {
    return this.http.post(`${API}/auth/register`, { username, password, full_name });
  }

  login(username: string, password: string) {
    return this.http.post(`${API}/auth/login`, { username, password });
  }

  listProducts(): Observable<any> {
    return this.http.get(`${API}/api/products`);
  }

  getProduct(id: number) {
    return this.http.get(`${API}/api/products/${id}`);
  }

  placeOrder(order: any) {
    return this.http.post(`${API}/api/orders`, order, this.headers());
  }
}
