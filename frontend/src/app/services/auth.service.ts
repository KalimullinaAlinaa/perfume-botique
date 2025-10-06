import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8000/auth';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { username, password });
  }

  register(username: string, password: string, full_name: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, { username, password, full_name });
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/me`);
  }
}
