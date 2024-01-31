import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable()
export class ShowsInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    console.log('Intercepted');

    request = request.clone({
      url:
        request.url.indexOf('http://') === -1 &&
        request.url.indexOf('https://') === -1
          ? environment.apiUrl + request.url
          : request.url,
    });

    console.log(request.urlWithParams);

    return next.handle(request);
  }
}
