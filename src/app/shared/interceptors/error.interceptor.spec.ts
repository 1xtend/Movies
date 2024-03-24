import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ErrorInterceptor } from './error.interceptor';
import { NotificationService } from '../services/notification.service';
import { expectError } from 'src/testing';

@Injectable({
  providedIn: 'root',
})
class TestService {
  constructor(private http: HttpClient) {}

  getMedia(): Observable<any> {
    return this.http.get('/test');
  }
}

describe('MediaInterceptor', () => {
  let service: TestService;
  let controller: HttpTestingController;

  const mockNotificationService = jasmine.createSpyObj('notificationService', [
    'openSnackbar',
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TestService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ErrorInterceptor,
          multi: true,
        },
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
      ],
    });

    service = TestBed.inject(TestService);
    controller = TestBed.inject(HttpTestingController);
  });

  it('should intercept error request', () => {
    service.getMedia().subscribe({
      error: (err) => {
        expectError(err);
        expect(mockNotificationService.openSnackbar).toHaveBeenCalled();
      },
    });

    const request = controller.expectOne('/test');

    expect(request.request.method).toBe('GET');
    controller.verify();
  });
});
