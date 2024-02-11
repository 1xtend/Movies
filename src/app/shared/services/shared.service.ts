import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { IMediaFilters } from '../models/filters.interface';
import { MediaType } from '../models/media.type';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { ViewportScroller } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private searchSubject = new Subject<string>();
  search$ = this.searchSubject.asObservable();

  private mediaTypeSubject = new Subject<MediaType>();
  mediaType$ = this.mediaTypeSubject.asObservable();

  constructor(private viewport: ViewportScroller) {}

  setSearchSubject(text: string): void {
    this.searchSubject.next(text);
  }

  setMediaTypeSubject(type: MediaType): void {
    this.mediaTypeSubject.next(type);
  }

  scrollToTop(): void {
    this.viewport.scrollToPosition([0, 0]);
  }
}
