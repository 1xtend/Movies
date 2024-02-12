import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MediaType } from '../models/media.type';
import { ViewportScroller } from '@angular/common';
import { Router } from '@angular/router';
import { IDiscoverParams, ISearchParams } from '../models/params.interface';
import { IGenres } from '../models/genres.interface';
import { IGenre } from './../models/genre.interface';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private searchSubject = new Subject<string>();
  search$ = this.searchSubject.asObservable();

  private mediaTypeSubject = new Subject<MediaType>();
  mediaType$ = this.mediaTypeSubject.asObservable();

  private genresSubject = new Subject<IGenres>();
  genres$ = this.genresSubject.asObservable();

  tvGenres: IGenre[] = [];
  movieGenres: IGenre[] = [];

  genres: { tv: IGenre[]; movie: IGenre[] } = {
    tv: [],
    movie: [],
  };

  constructor(private viewport: ViewportScroller, private router: Router) {}

  setSearchSubject(text: string): void {
    this.searchSubject.next(text);
  }

  setMediaTypeSubject(type: MediaType): void {
    this.mediaTypeSubject.next(type);
  }

  setGenresSubject(genres: IGenres): void {
    this.genresSubject.next(genres);
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
