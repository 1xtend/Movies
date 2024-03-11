import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { MediaType } from '../models/media.type';
import { ViewportScroller } from '@angular/common';
import { Router } from '@angular/router';
import { SavedGenresType } from '../models/genres.interface';
import { IGenre } from './../models/genres.interface';
import { ILanguage } from '../models/language.interface';
import {
  IMoviesResponse,
  INowPlayingMoviesResponse,
} from '../models/movie/movies-response.interface';
import { ITVsResponse } from '../models/tv/tvs-response.interface';
import { IFilters } from '../models/filters.interface';
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

  private nowPlayingMoviesSubject = new BehaviorSubject<
    INowPlayingMoviesResponse | undefined
  >(undefined);
  nowPlayingMovies$ = this.nowPlayingMoviesSubject.asObservable();

  private languagesSubject = new BehaviorSubject<ILanguage[]>([]);
  languages$ = this.languagesSubject.asObservable();

  readonly fetchDebounceTime: number = 1000;

  constructor(private viewport: ViewportScroller, private router: Router) {}

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

  setNowPlayingMoviesSubject(movies: INowPlayingMoviesResponse): void {
    this.nowPlayingMoviesSubject.next(movies);
  }

  scrollToTop(): void {
    this.viewport.scrollToPosition([0, 0]);
  }

  setParams(params: IFilters, path: string, mediaType: MediaType): void {
    const queryParams: IFilters = {
      page: params.page,
      include_adult: params.include_adult,
    };

    if (params.query) {
      queryParams.query = params.query;
    }
    if (params.language && params.language !== 'xx') {
      queryParams.language = params.language;
    }
    if (params.sort_by) {
      queryParams.sort_by = params.sort_by;
    }
    if (params.with_genres) {
      queryParams.with_genres = params.with_genres;
    }
    if (params.primary_release_year) {
      queryParams.primary_release_year = params.primary_release_year;
    }
    if (params.first_air_date_year) {
      queryParams.first_air_date_year = params.first_air_date_year;
    }
    if (params['vote_average.gte'] && params['vote_average.gte'] !== 0) {
      queryParams['vote_average.gte'] = params['vote_average.gte'];
    }
    if (params['vote_average.lte'] && params['vote_average.lte'] !== 10) {
      queryParams['vote_average.lte'] = params['vote_average.lte'];
    }

    this.router.navigate([path, mediaType], {
      queryParams,
    });
  }
}
