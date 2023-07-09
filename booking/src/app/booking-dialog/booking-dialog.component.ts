import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookingService } from '../services/booking.service';
import { SnackbarService } from '../services/snackbar.service';
import { DateTime } from 'luxon';
@Component({
  selector: 'app-booking-dialog',
  templateUrl: './booking-dialog.component.html',
  styleUrls: ['./booking-dialog.component.scss'],
})
export class BookingDialogComponent implements OnInit {
  @ViewChild('bookingFromTime') bookingFromTime: any;

  bookingForm: FormGroup;
  bookingTypes = ['Full Day', 'Half Day', 'Custom'];

  // first half be 09:00 to 13:00 and second half be 13:00 to 17:00
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
      bookingFromTime: ['', Validators.required],
      bookingToTime: ['', Validators.required],
      bookingSlot: [''],
    });
  }

  ngOnInit(): void {
    this.subscribeToBookingTypeChanges();
  }

  private subscribeToBookingTypeChanges(): void {
    const bookingTypeControl = this.bookingForm.get('bookingType');

    if (bookingTypeControl) {
      bookingTypeControl.valueChanges.subscribe((value: string) => {
        this.setTime(null, null);
        const bookingSlotControl = this.bookingForm.get('bookingSlot');
        bookingSlotControl?.setValue(null);
        
        if (bookingSlotControl) {
          if (value === 'Full Day') {
            this.setTime('09:00', '17:00');
          }
          if (value === 'Half Day') {
            bookingSlotControl.valueChanges.subscribe((slot: string) => {
              if (slot == 'First Half') {
                this.setTime('09:00', '13:00');
              }
              if (slot == 'Second Half') {
                this.setTime('13:00', '17:00');
              }
            });
            bookingSlotControl.setValidators(Validators.required);
          } else {
            bookingSlotControl.clearValidators();
          }
          bookingSlotControl.updateValueAndValidity();
        }
      });
    }
  }

  private setTime(start: any, end: any) {
    const bookingFromTimeControl = this.bookingForm.get('bookingFromTime');
    const bookingToTimeControl = this.bookingForm.get('bookingToTime');
    bookingFromTimeControl?.setValue(start);
    bookingToTimeControl?.setValue(end);
  }

  onSubmit(): void {
    if (this.bookingForm.invalid) {
      return;
    }
    const bookingData = { ...this.bookingForm.value };
    const date = DateTime.fromJSDate(bookingData.bookingDate).toFormat(
      'dd/MM/yyyy'
    );
    const fullFormat = 'dd/MM/yyyy HH:mm';
    bookingData.bookingFromTime = DateTime.fromFormat(
      `${date} ${bookingData.bookingFromTime}`,
      fullFormat
    ).toJSDate();

    bookingData.bookingToTime = DateTime.fromFormat(
      `${date} ${bookingData.bookingToTime}`,
      fullFormat
    ).toJSDate();

    this.bookingService
      .createBooking(bookingData)
      .then((resp) => {
        this.onCancel(resp);
      })
      .catch((error) => {
        console.log(error);
        this.snackbarService.showError(
          error?.error?.message || 'Some error occured'
        );
        console.error('Booking failed:', error);
      });
  }

  onCancel(data?: any): void {
    this.dialogRef.close(data);
  }
}
