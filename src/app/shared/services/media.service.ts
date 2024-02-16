import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { IDiscoverFilters, IMediaFilters } from '../models/filters.interface';
import { MediaType } from '../models/media.type';
import { ISearchPeopleResponse } from '../models/person/people-response.interface';
import { ISearchTVsResponse } from '../models/tv/tvs-response.interface';
import { ISearchMoviesResponse } from '../models/movie/movies-response.interface';
import { IDetailsTV, ITV } from '../models/tv/tv.interface';
import { IDetailsMovie, IMovie } from '../models/movie/movie.interface';
import { IDetailsPerson, IPerson } from '../models/person/person.interface';
import { IGenres } from '../models/genres.interface';

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

  searchPeople(filters: IMediaFilters): Observable<ISearchPeopleResponse> {
    return this.search<ISearchPeopleResponse>('person', filters);
  }

  searchTV(filters: IMediaFilters): Observable<ISearchTVsResponse> {
    return this.search<ISearchTVsResponse>('tv', filters);
  }

  searchMovie(filters: IMediaFilters): Observable<ISearchMoviesResponse> {
    return this.search<ISearchMoviesResponse>('movie', filters);
  }

  // Details
  private getDetails<T>(type: MediaType, id: number): Observable<T> {
    return this.http.get<T>(`/${type}/${id}`);
  }

  getTVDetails(id: number): Observable<IDetailsTV> {
    return this.getDetails<IDetailsTV>('tv', id);
  }

  getMovieDetails(id: number): Observable<IDetailsMovie> {
    return this.getDetails<IDetailsMovie>('movie', id);
  }

  getPersonDetails(id: number): Observable<IDetailsPerson> {
    return this.getDetails<IDetailsPerson>('person', id);
  }

  // Popular
  private getPopular<T>(mediaType: MediaType): Observable<T> {
    return this.http.get<T>(`/${mediaType}/popular`);
  }

  getPopularMovies() {
    return this.getPopular<IMovie>('movie');
  }

  getPopularTVs() {
    return this.getPopular<ITV>('tv');
  }

  getPopularPeople() {
    return this.getPopular<IPerson>('person');
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

    return this.http.get<T>(`/discover/${type}`, {
      params,
    });
  }

  discoverMovies(filters: IDiscoverFilters): Observable<ISearchMoviesResponse> {
    return this.discover<ISearchMoviesResponse>('movie', filters);
  }

  discoverTVs(filters: IDiscoverFilters): Observable<ISearchTVsResponse> {
    return this.discover<ISearchTVsResponse>('tv', filters);
  }

  // Genres
  getGenres(type: Exclude<MediaType, 'person'>): Observable<IGenres> {
    return this.http.get<IGenres>(`/genre/${type}/list`);
  }
}
