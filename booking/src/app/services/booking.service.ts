import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(private authService: AuthService, private http: HttpClient) {}

  getBookings() {
    return firstValueFrom(
      this.http.get<any[]>(`${this.authService.baseUrl}/booking`)
    );
  }

  createBooking(bookingData: any) {
    return firstValueFrom(
      this.http.post<any[]>(`${this.authService.baseUrl}/booking`, bookingData)
    );
  }
}
