import { LoadingService } from './../services/loading.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable()
export class MediaInterceptor implements HttpInterceptor {
  constructor(private loadingService: LoadingService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.loadingService.setLoading(true);

    console.log('Request started', request);

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

    return next.handle(request).pipe(
      finalize(() => {
        this.loadingService.setLoading(false);
      })
    );
  }
}
