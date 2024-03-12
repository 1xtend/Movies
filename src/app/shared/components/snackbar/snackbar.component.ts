import { MatSnackBarRef } from '@angular/material/snack-bar';
import { NotificationService } from './../../services/notification.service';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SnackbarComponent {
  constructor(
    public notificationService: NotificationService,
    public snackbarRef: MatSnackBarRef<SnackbarComponent>
  ) {}
}
