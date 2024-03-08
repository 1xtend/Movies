import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { MediaType } from '../models/media.type';
import { ViewportScroller } from '@angular/common';
import { Router } from '@angular/router';
import { SavedGenresType } from '../models/genres.interface';
import { IGenre } from './../models/genres.interface';
import { ILanguage } from '../models/languages.interface';
import { IMoviesResponse } from '../models/movie/movies-response.interface';
import { ITVsResponse } from '../models/tv/tvs-response.interface';
import { IDiscoverFilters, IMediaFilters } from '../models/filters.interface';
import { IPeopleResponse } from '../models/person/people-response.interface';

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

  private popularTVsSubject = new BehaviorSubject<ITVsResponse | undefined>(
    undefined
  );
  popularTVs$ = this.popularTVsSubject.asObservable();

  private popularPeopleSubject = new BehaviorSubject<
    IPeopleResponse | undefined
  >(undefined);
  popularPeople$ = this.popularPeopleSubject.asObservable();

  readonly fetchDebounceTime: number = 1000;

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

  setPopularTVsSubject(tvs: ITVsResponse): void {
    this.popularTVsSubject.next(tvs);
  }

  setPopularPeopleSubject(people: IPeopleResponse): void {
    this.popularPeopleSubject.next(people);
  }

  scrollToTop(): void {
    this.viewport.scrollToPosition([0, 0]);
  }

  setParams(
    params: IMediaFilters | IDiscoverFilters,
    path: string,
    mediaType: MediaType
  ): void {
    this.router.navigate([path, mediaType], {
      queryParams: params,
    });
  }
}
