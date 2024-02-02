import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IShowsResponse } from '../models/shows/shows-response.interface';
import { Observable } from 'rxjs';
import { MediaType } from '../models/media.type';
import { IPeopleResponse } from '../models/person/people-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ShowsService {
  constructor(private http: HttpClient) {}

  searchShows(query: string, page: number = 1): Observable<IShowsResponse> {
    return this.http.get<IShowsResponse>(`/search/movie`, {
      params: {
        query,
        page,
      },
    });
  }

  search(
    type: Extract<MediaType, 'tv' | 'movie'>,
    query: string,
    page: number
  ): Observable<IShowsResponse>;
  search(
    type: Extract<MediaType, 'person'>,
    query: string,
    page: number
  ): Observable<IPeopleResponse>;
  search(
    type: MediaType,
    query: string,
    page: number = 1
  ): Observable<IShowsResponse | IPeopleResponse> {
    return this.http.get<IShowsResponse | IPeopleResponse>(`/search/${type}`, {
      params: {
        query,
        page,
      },
    });
  }
}
