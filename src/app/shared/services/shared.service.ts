import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { IMediaFilters } from '../models/media-filters.interface';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private searchSubject = new BehaviorSubject<string>('');
  search$ = this.searchSubject.asObservable();

  private mediaFiltersSubject = new Subject<IMediaFilters>();
  mediaFilters$ = this.mediaFiltersSubject.asObservable();

  constructor() {}

  setSearchSubject(text: string): void {
    this.searchSubject.next(text);
  }

  setMediaFilters(filters: IMediaFilters): void {
    this.mediaFiltersSubject.next(filters);
  }
}
