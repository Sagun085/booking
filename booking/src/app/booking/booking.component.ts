import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { BookingService } from '../services/booking.service';
import { MatDialog } from '@angular/material/dialog';
import { BookingDialogComponent } from '../booking-dialog/booking-dialog.component';

export interface Booking {
  bookingDate: string;
  bookingType: string;
  bookingSlot?: string;
  bookingTime?: string;
}

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
})
export class BookingComponent {
  bookings: Booking[] = [];
  displayedColumns: string[] = [
    'bookingDate',
    'bookingType',
    'bookingSlot',
    'bookingTime',
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private bookingService: BookingService,
    private dialog: MatDialog
  ) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(BookingDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchBookings();
      }
    });
  }

  async ngOnInit(): Promise<void> {
    await this.authService.varifyToken();
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
    this.fetchBookings();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  fetchBookings(): void {
    this.bookingService
      .getBookings()
      .then((resp) => {
        this.bookings = resp;
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
