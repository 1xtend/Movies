import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { IDiscoverFilters, IMediaFilters } from '../models/filters.interface';
import { MediaType } from '../models/media.type';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { ViewportScroller } from '@angular/common';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { IDiscoverParams, ISearchParams } from '../models/params.interface';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private searchSubject = new Subject<string>();
  search$ = this.searchSubject.asObservable();

  private mediaTypeSubject = new Subject<MediaType>();
  mediaType$ = this.mediaTypeSubject.asObservable();

  constructor(private viewport: ViewportScroller, private router: Router) {}

  setSearchSubject(text: string): void {
    this.searchSubject.next(text);
  }

  setMediaTypeSubject(type: MediaType): void {
    this.mediaTypeSubject.next(type);
  }

  scrollToTop(): void {
    this.viewport.scrollToPosition([0, 0]);
  }

  setParams(
    params: IDiscoverParams | ISearchParams,
    path: string,
    mediaType: MediaType
  ): void {
    this.router.navigate([path, mediaType], {
      queryParams: params,
    });
  }
}
