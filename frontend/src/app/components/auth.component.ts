import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  username = '';
  password = '';
  full = '';

  constructor(private api: ApiService, private router: Router) {}

  login() {
    this.api.login(this.username, this.password).subscribe({
      next: (res: any) => {
        this.api.setToken(res.access_token);
        alert('Logged in');
        this.router.navigate(['']);
      },
      error: () => alert('Login failed')
    });
  }

  register() {
    this.api.register(this.username, this.password, this.full).subscribe({
      next: (res: any) => {
        this.api.setToken(res.access_token);
        alert('Registered');
        this.router.navigate(['']);
      },
      error: () => alert('Register failed')
    });
  }
}
