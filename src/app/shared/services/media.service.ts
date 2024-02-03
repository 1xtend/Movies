import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPeopleResponse } from '../models/person/people-response.interface';
import { IMediaFilters } from '../models/media-filters.interface';
import { MediaType } from '../models/media.enum';
import { ITVResponse } from '../models/tv/tv-response.interface';
import { IMovieResponse } from '../models/movie/movie-response.interface';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  constructor(private http: HttpClient) {}

  searchPeople(filters: IMediaFilters): Observable<IPeopleResponse> {
    const params = new HttpParams({
      fromObject: {
        query: filters.query,
        page: filters.page,
      },
    });

    return this.http.get<IPeopleResponse>(`/search/${MediaType.PERSON}`, {
      params,
    });
  }

  searchTV(filters: IMediaFilters): Observable<ITVResponse> {
    const params = new HttpParams({
      fromObject: {
        query: filters.query,
        page: filters.page,
      },
    });

    return this.http.get<ITVResponse>(`/search/${MediaType.TV}`, {
      params,
    });
  }

  searchMovie(filters: IMediaFilters): Observable<IMovieResponse> {
    const params = new HttpParams({
      fromObject: {
        query: filters.query,
        page: filters.page,
      },
    });

    return this.http.get<IMovieResponse>(`/search/${MediaType.MOVIE}`, {
      params,
    });
  }
}
