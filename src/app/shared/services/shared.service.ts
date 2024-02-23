import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { MediaType } from '../models/media.type';
import { ViewportScroller } from '@angular/common';
import { Router } from '@angular/router';
import { IDiscoverParams, ISearchParams } from '../models/params.interface';
import { IGenres, SavedGenresType } from '../models/genres.interface';
import { IGenre } from './../models/genres.interface';
import { ILanguage } from '../models/languages.interface';
import { IMoviesResponse } from '../models/movie/movies-response.interface';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private searchSubject = new Subject<string>();
  search$ = this.searchSubject.asObservable();

  private mediaTypeSubject = new Subject<MediaType>();
  mediaType$ = this.mediaTypeSubject.asObservable();

  private genres: SavedGenresType = {
    movie: undefined,
    tv: undefined,
  };
  private genresSubject = new BehaviorSubject<SavedGenresType>(this.genres);
  genres$ = this.genresSubject.asObservable();

  private popularMoviesSubject = new BehaviorSubject<
    IMoviesResponse | undefined
  >(undefined);
  popularMovies$ = this.popularMoviesSubject.asObservable();

  constructor(private viewport: ViewportScroller, private router: Router) {}

  private languagesSubject = new BehaviorSubject<ILanguage[]>([]);
  languages$ = this.languagesSubject.asObservable();

  setSearchSubject(text: string): void {
    this.searchSubject.next(text);
  }

  setMediaTypeSubject(type: MediaType): void {
    this.mediaTypeSubject.next(type);
  }

  setGenresSubject(genres: IGenre[], type: Exclude<MediaType, 'person'>): void {
    this.genres[type] = genres;

    this.genresSubject.next(this.genres);
  }

  setLanguagesSubject(languages: ILanguage[]): void {
    this.languagesSubject.next(languages);
  }

  setPopularMoviesSubject(movies: IMoviesResponse): void {
    this.popularMoviesSubject.next(movies);
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
