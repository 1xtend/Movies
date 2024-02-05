import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { IMediaFilters } from '../models/media-filters.interface';
import { MediaType } from '../models/media.type';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private searchSubject = new BehaviorSubject<string>('');
  search$ = this.searchSubject.asObservable();

  private mediaFiltersSubject = new Subject<IMediaFilters>();
  mediaFilters$ = this.mediaFiltersSubject.asObservable();

  private mediaTypeSubject = new Subject<MediaType>();
  mediaType$ = this.mediaTypeSubject.asObservable();

  constructor() {}

  setSearchSubject(text: string): void {
    this.searchSubject.next(text);
  }

  setMediaFilters(filters: IMediaFilters): void {
    this.mediaFiltersSubject.next(filters);
  }

  setMediaTypeSubject(type: MediaType): void {
    this.mediaTypeSubject.next(type);
  }
}
