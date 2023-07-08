import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  async ngOnInit(): Promise<void> {
    await this.authService.varifyToken();
    // if (this.authService.isAuthenticated()) {
    //   this.router.navigate(['/booking']);
    // }
  }

  login() {
    this.router.navigate(['/login']);
  }

  register(): void {
    const registrationData = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
    };

    this.http
      .post(`${this.authService.baseUrl}/signup`, registrationData)
      .pipe(
        tap((response) => {
          console.log('Registration successful:', response);
          this.router.navigate(['/login']);
        }),
        catchError((error) => {
          console.error('Registration failed:', error);
          return of(null);
        })
      )
      .subscribe();
  }
}
