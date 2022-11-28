import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  baseConfig: MatSnackBarConfig<any> = {
    duration: 2000,
    horizontalPosition: 'center',
    verticalPosition: 'top',
  };

  constructor(private snackBar: MatSnackBar) {}

  error(message: string) {
    this.snackBar.open(message, 'Error', this.baseConfig);
  }

  success(message: string) {
    this.snackBar.open(message, 'Success', this.baseConfig);
  }
}
