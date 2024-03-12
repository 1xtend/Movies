import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { SnackbarComponent } from '../components/snackbar/snackbar.component';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private messageSubject = new BehaviorSubject<string>('');
  message$ = this.messageSubject.asObservable();

  constructor(private snackBar: MatSnackBar) {}

  openSnackbar(message: string, duration?: number) {
    this.messageSubject.next(message);

    this.snackBar.openFromComponent(SnackbarComponent, {
      duration,
    });
  }
}
