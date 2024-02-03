import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPeopleResponse } from '../models/person/people-response.interface';
import { IMediaFilters } from '../models/media-filters.interface';
import { MediaType } from '../models/media.type';
import { ITVResponse } from '../models/tv/tv-response.interface';
import { IMovieResponse } from '../models/movie/movie-response.interface';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  constructor(private http: HttpClient) {}

  // searchPeople(filters: IMediaFilters): Observable<IPeopleResponse> {
  //   const params = new HttpParams({
  //     fromObject: {
  //       query: filters.query,
  //       page: filters.page,
  //     },
  //   });

  //   return this.http.get<IPeopleResponse>(`/search/${MediaType.PERSON}`, {
  //     params,
  //   });
  // }

  // searchTV(filters: IMediaFilters): Observable<ITVResponse> {
  //   const params = new HttpParams({
  //     fromObject: {
  //       query: filters.query,
  //       page: filters.page,
  //     },
  //   });

  //   return this.http.get<ITVResponse>(`/search/${MediaType.TV}`, {
  //     params,
  //   });
  // }

  // searchMovie(filters: IMediaFilters): Observable<IMovieResponse> {
  //   const params = new HttpParams({
  //     fromObject: {
  //       query: filters.query,
  //       page: filters.page,
  //     },
  //   });

  //   return this.http.get<IMovieResponse>(`/search/${MediaType.MOVIE}`, {
  //     params,
  //   });
  // }

  searchPeople(filters: IMediaFilters): Observable<IPeopleResponse> {
    return this.search<IPeopleResponse>('person', filters);
  }

  searchTV(filters: IMediaFilters): Observable<ITVResponse> {
    return this.search<ITVResponse>('tv', filters);
  }

  searchMovie(filters: IMediaFilters): Observable<IMovieResponse> {
    return this.search<IMovieResponse>('movie', filters);
  }

  private search<T>(type: MediaType, filters: IMediaFilters): Observable<T> {
    const params = new HttpParams({
      fromObject: {
        query: filters.query,
        page: filters.page,
      },
    });

    return this.http.get<T>(`/search/${type}`, {
      params,
    });
  }
}
