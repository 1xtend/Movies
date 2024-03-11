import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IFilters } from '../models/filters.interface';
import { MediaType } from '../models/media.type';
import { IPeopleResponse } from '../models/person/people-response.interface';
import { ITVsResponse } from '../models/tv/tvs-response.interface';
import {
  IMoviesResponse,
  INowPlayingMoviesResponse,
} from '../models/movie/movies-response.interface';
import { IDetailsTV } from '../models/tv/tv.interface';
import { IDetailsMovie } from '../models/movie/movie.interface';
import { IDetailsPerson } from '../models/person/person.interface';
import { IGenres } from '../models/genres.interface';
import { ILanguage } from '../models/language.interface';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  constructor(private http: HttpClient) {}

  // Search
  private search<T>(type: MediaType, filters: IFilters): Observable<T> {
    let params = new HttpParams({
      fromObject: {
        ...filters,
      },
    });

    return this.http.get<T>(`/search/${type}`, {
      params,
    });
  }

  searchPeople(filters: IFilters): Observable<IPeopleResponse> {
    return this.search<IPeopleResponse>('person', filters);
  }

  searchTV(filters: IFilters): Observable<ITVsResponse> {
    return this.search<ITVsResponse>('tv', filters);
  }

  searchMovie(filters: IFilters): Observable<IMoviesResponse> {
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
      params = params.append('append_to_response', 'similar,reviews');
    } else {
      params = params.append('append_to_response', 'images');
    }

    if (language && language !== 'xx') {
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

  // Now playing movies
  getNowPlayingMovies(): Observable<INowPlayingMoviesResponse> {
    return this.http.get<INowPlayingMoviesResponse>('/movie/now_playing');
  }

  // Top rated movies
  getTopRatedMovies(): Observable<IMoviesResponse> {
    return this.http.get<IMoviesResponse>('/movie/top_rated');
  }
  // On the air tv series
  getOnTheAirTV(): Observable<ITVsResponse> {
    return this.http.get<ITVsResponse>('/tv/on_the_air');
  }

  // Discover
  private discover<T>(
    type: Exclude<MediaType, 'person'>,
    filters: IFilters
  ): Observable<T> {
    let params = new HttpParams({
      fromObject: {
        page: filters.page,
      },
    });

    if (filters.sort_by) {
      params = params.append('sort_by', filters.sort_by);
    }

    if (filters.with_genres) {
      params = params.append('with_genres', filters.with_genres);
    }

    if (filters.include_adult) {
      params = params.append('include_adult', filters.include_adult);
    }

    if (filters.language) {
      params = params.append('language', filters.language);
    }

    if (filters.first_air_date_year) {
      params = params.append(
        'first_air_date_year',
        filters.first_air_date_year
      );
    }

    if (filters.primary_release_year) {
      params = params.append(
        'primary_release_year',
        filters.primary_release_year
      );
    }

    if (filters['vote_average.gte']) {
      params = params.append('vote_average.gte', filters['vote_average.gte']);
    }

    if (filters['vote_average.lte']) {
      params = params.append('vote_average.lte', filters['vote_average.lte']);
    }

    return this.http.get<T>(`/discover/${type}`, {
      params,
    });
  }

  discoverMovies(filters: IFilters): Observable<IMoviesResponse> {
    return this.discover<IMoviesResponse>('movie', filters);
  }

  discoverTVs(filters: IFilters): Observable<ITVsResponse> {
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
