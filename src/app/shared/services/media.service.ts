import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPeopleResponse } from '../models/person/people-response.interface';
import { IMediaFilters } from '../models/media-filters.interface';
import { MediaType } from '../models/media.type';
import { ITVsResponse } from '../models/tv/tvs-response.interface';
import { IMoviesResponse } from '../models/movie/movies-response.interface';

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

  searchTV(filters: IMediaFilters): Observable<ITVsResponse> {
    return this.search<ITVsResponse>('tv', filters);
  }

  searchMovie(filters: IMediaFilters): Observable<IMoviesResponse> {
    return this.search<IMoviesResponse>('movie', filters);
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
