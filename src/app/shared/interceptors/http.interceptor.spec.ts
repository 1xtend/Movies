import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MediaInterceptor } from './http.interceptor';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TestService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: MediaInterceptor,
          multi: true,
        },
      ],
    });

    service = TestBed.inject(TestService);
    controller = TestBed.inject(HttpTestingController);
  });

  it('should intercept request', () => {
    service.getMedia().subscribe();

    const request = controller.expectOne(
      `https://api.themoviedb.org/3/test?api_key=${environment.apiKey}`
    );

    expect(request.request.method).toBe('GET');
    controller.verify();
  });
});
