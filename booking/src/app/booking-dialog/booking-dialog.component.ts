import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookingService } from '../services/booking.service';
import { SnackbarService } from '../services/snackbar.service';

@Component({
  selector: 'app-booking-dialog',
  templateUrl: './booking-dialog.component.html',
  styleUrls: ['./booking-dialog.component.scss'],
})
export class BookingDialogComponent implements OnInit {
  bookingForm: FormGroup;
  bookingTypes = ['Full Day', 'Half Day', 'Custom'];
  bookingSlots = ['First Half', 'Second Half'];
  minDate: Date = new Date();

  constructor(
    private dialogRef: MatDialogRef<BookingDialogComponent>,
    private formBuilder: FormBuilder,
    private bookingService: BookingService,
    private snackbarService: SnackbarService
  ) {
    this.bookingForm = this.formBuilder.group({
      bookingDate: ['', Validators.required],
      bookingType: ['', Validators.required],
      bookingSlot: [''],
      bookingTime: [''],
    });
  }

  ngOnInit(): void {
    this.subscribeToBookingTypeChanges();
  }

  private subscribeToBookingTypeChanges(): void {
    const bookingTypeControl = this.bookingForm.get('bookingType');

    if (bookingTypeControl) {
      bookingTypeControl.valueChanges.subscribe((value: string) => {
        const bookingSlotControl = this.bookingForm.get('bookingSlot');
        const bookingTimeControl = this.bookingForm.get('bookingTime');

        if (bookingSlotControl && bookingTimeControl) {
          if (value === 'Half Day') {
            bookingSlotControl.setValidators(Validators.required);
            bookingTimeControl.clearValidators();
          } else if (value === 'Custom') {
            bookingTimeControl.setValidators(Validators.required);
            bookingSlotControl.clearValidators();
          } else {
            bookingSlotControl.clearValidators();
            bookingTimeControl.clearValidators();
          }

          bookingSlotControl.updateValueAndValidity();
          bookingTimeControl.updateValueAndValidity();
        }
      });
    }
  }

  onSubmit(): void {
    if (this.bookingForm.invalid) {
      return;
    }
    const bookingData = this.bookingForm.value;
    this.bookingService
      .createBooking(bookingData)
      .then((resp) => {
        this.onCancel(resp);
      })
      .catch((error) => {
        console.log(error)
        this.snackbarService.showError(error?.error?.message || "Some error occured")
        console.error('Booking failed:', error);
      });
  }

  onCancel(data?: any): void {
    this.dialogRef.close(data);
  }
}
