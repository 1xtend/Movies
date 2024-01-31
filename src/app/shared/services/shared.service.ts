import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private searchSubject = new Subject<string>();
  search$ = this.searchSubject.asObservable();

  setSearchSubject(text: string): void {
    this.searchSubject.next(text);
  }

  constructor() {}
}
