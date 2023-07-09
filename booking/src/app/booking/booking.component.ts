import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { BookingService } from '../services/booking.service';
import { MatDialog } from '@angular/material/dialog';
import { BookingDialogComponent } from '../booking-dialog/booking-dialog.component';
import { SnackbarService } from '../services/snackbar.service';
import { DateTime } from 'luxon';

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
    'bookingFromTime',
    'bookingToTime',
    'action',
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private bookingService: BookingService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService
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

  getTimeFromDate(date: any) {
    const _date = DateTime.fromISO(date)
    return _date.toFormat("hh:mm a")
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

  deleteBooking(id: string) {
    this.bookingService
      .deleteBooking(id)
      .then((resp) => {
        this.fetchBookings();
      })
      .catch((error) => {
        this.snackbarService.showError(
          error?.error?.message || 'Some error occured'
        );
        console.error(error);
      });
  }
}
