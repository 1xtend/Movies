import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { EMPTY, Observable, catchError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private notificationService: NotificationService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((res) => {
        this.notificationService.openSnackbar(
          res.error.status_message ?? 'Ooops, something went wrong',
          5000
        );

        return EMPTY;
      })
    );
  }
}
