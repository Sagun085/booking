import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  showError(message: string, color: string = 'error-snackbar'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: color,
      horizontalPosition: "end",
      verticalPosition: "top",
    });
  }
}
