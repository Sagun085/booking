import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfigService } from './api-config.service';
import { tap, catchError } from 'rxjs/operators';
import { of, firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userData: any = null;
  baseUrl = '';

  constructor(
    private http: HttpClient,
    private apiConfigService: ApiConfigService,
    private router: Router
  ) {
    this.baseUrl = this.apiConfigService.getBaseUrl();
  }

  logout(): void {
    this.http
      .get(`${this.baseUrl}/logout`)
      .pipe(
        tap((response) => {
          console.log('Registration successful:', response);
          localStorage.clear();
          this.router.navigate(['/login']);
        }),
        catchError((error) => {
          console.error('Registration failed:', error);
          return of(null);
        })
      )
      .subscribe();
  }

  setUserData(data: any) {
    this.userData = data;
  }

  getUserData() {
    return this.userData;
  }

  async varifyToken() {
    try {
      const resp = await firstValueFrom(
        this.http.get(`${this.baseUrl}/varify`)
      );
      this.setUserData(resp);
    } catch (error) {
      this.setUserData(null);
      throw error;
    }
  }

  isAuthenticated(): boolean {
    return !!this.userData;
  }
}
