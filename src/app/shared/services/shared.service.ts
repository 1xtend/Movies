import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { MediaType } from '../models/media.type';
import { ViewportScroller } from '@angular/common';
import { Router } from '@angular/router';
import { SavedGenresType } from '../models/genres.interface';
import { IGenre } from './../models/genres.interface';
import { ILanguage } from '../models/language.interface';
import { IFilters } from '../models/filters.interface';
import { ITV } from '../models/tv/tv.interface';
import { IMovie } from '../models/movie/movie.interface';
import { IPerson } from '../models/person/person.interface';

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

  mediaTrackBy(index: number, media: ITV | IMovie | IPerson) {
    return media.id;
  }
}
