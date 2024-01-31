import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpParams,
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

    const url =
      request.url.indexOf('http://') === -1 &&
      request.url.indexOf('https://') === -1
        ? environment.apiUrl + request.url
        : request.url;

    const params = request.params.has('api_key')
      ? undefined
      : request.params.set('api_key', environment.apiKey);

    request = request.clone({
      url,
      params,
    });

    console.log(request.urlWithParams);

    return next.handle(request);
  }
}
