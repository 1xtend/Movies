import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDiscoverFilters, IMediaFilters } from '../models/filters.interface';
import { MediaType } from '../models/media.type';
import { IPeopleResponse } from '../models/person/people-response.interface';
import { ITVsResponse } from '../models/tv/tvs-response.interface';
import { IMoviesResponse } from '../models/movie/movies-response.interface';
import { IDetailsTV } from '../models/tv/tv.interface';
import { IDetailsMovie } from '../models/movie/movie.interface';
import { IDetailsPerson, IPerson } from '../models/person/person.interface';
import { IGenres } from '../models/genres.interface';
import { ILanguage } from '../models/languages.interface';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  constructor(private http: HttpClient) {}

  // Search
  private search<T>(type: MediaType, filters: IMediaFilters): Observable<T> {
    let params = new HttpParams({
      fromObject: {
        ...filters,
      },
    });

    return this.http.get<T>(`/search/${type}`, {
      params,
    });
  }

  searchPeople(filters: IMediaFilters): Observable<IPeopleResponse> {
    return this.search<IPeopleResponse>('person', filters);
  }

  searchTV(filters: IMediaFilters): Observable<ITVsResponse> {
    return this.search<ITVsResponse>('tv', filters);
  }

  searchMovie(filters: IMediaFilters): Observable<IMoviesResponse> {
    return this.search<IMoviesResponse>('movie', filters);
  }

  // Details
  private getDetails<T>(
    type: MediaType,
    id: number,
    language?: string
  ): Observable<T> {
    let params = new HttpParams();

    if (type !== 'person') {
      params = params.append('append_to_response', 'similar');
    }

    if (language) {
      params = params.append('language', language);
    }

    return this.http.get<T>(`/${type}/${id}`, {
      params,
    });
  }

  getTVDetails(id: number, language?: string): Observable<IDetailsTV> {
    return this.getDetails<IDetailsTV>('tv', id, language);
  }

  getMovieDetails(id: number, language?: string): Observable<IDetailsMovie> {
    return this.getDetails<IDetailsMovie>('movie', id, language);
  }

  getPersonDetails(id: number): Observable<IDetailsPerson> {
    return this.getDetails<IDetailsPerson>('person', id);
  }

  // Popular
  private getPopular<T>(mediaType: MediaType): Observable<T> {
    return this.http.get<T>(`/${mediaType}/popular`);
  }

  getPopularMovies() {
    return this.getPopular<IMoviesResponse>('movie');
  }

  getPopularTVs() {
    return this.getPopular<ITVsResponse>('tv');
  }

  getPopularPeople() {
    return this.getPopular<IPeopleResponse>('person');
  }

  // Discover
  private discover<T>(
    type: Exclude<MediaType, 'person'>,
    filters: IDiscoverFilters
  ): Observable<T> {
    let params = new HttpParams({
      fromObject: {
        page: filters.page,
        sort_by: filters.sort_by,
      },
    });

    if (filters.with_genres) {
      params = params.append('with_genres', filters.with_genres);
    }

    if (filters.include_adult) {
      params = params.append('include_adult', filters.include_adult);
    }

    if (filters.language) {
      params = params.append('language', filters.language);
    }

    if (filters['vote_average.gte']) {
      console.log('has');
      params = params.append('vote_average.gte', filters['vote_average.gte']);
    }

    if (filters['vote_average.lte']) {
      params = params.append('vote_average.lte', filters['vote_average.lte']);
    }

    return this.http.get<T>(`/discover/${type}`, {
      params,
    });
  }

  discoverMovies(filters: IDiscoverFilters): Observable<IMoviesResponse> {
    return this.discover<IMoviesResponse>('movie', filters);
  }

  discoverTVs(filters: IDiscoverFilters): Observable<ITVsResponse> {
    return this.discover<ITVsResponse>('tv', filters);
  }

  // Genres
  getGenres(type: Exclude<MediaType, 'person'>): Observable<IGenres> {
    return this.http.get<IGenres>(`/genre/${type}/list`);
  }

  // Languages
  getLanguages(): Observable<ILanguage[]> {
    return this.http.get<ILanguage[]>(`/configuration/languages`);
  }
}
