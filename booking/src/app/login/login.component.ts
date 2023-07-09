import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  async ngOnInit(): Promise<void> {
    await this.authService.varifyToken();
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/booking']);
    }
  }

  async login(): Promise<void> {
    const data = {
      email: this.email,
      password: this.password,
    };

    try {
      const response = await firstValueFrom<any>(
        this.http.post(`${this.authService.baseUrl}/login`, data)
      );
      localStorage.setItem('sessionToken', response?.token);
      this.authService.setUserData(response?.data);

      this.router.navigate(['/booking']);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  }

  
  register() {
    this.router.navigate(['/register']);
  }

}
