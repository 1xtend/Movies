import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IMediaFilters } from '../models/media-filters.interface';
import { MediaType } from '../models/media.type';
import { ISearchPeopleResponse } from '../models/person/people-response.interface';
import { ISearchTVsResponse } from '../models/tv/tvs-response.interface';
import { ISearchMoviesResponse } from '../models/movie/movies-response.interface';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  constructor(private http: HttpClient) {}

  // Search
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

  getTVDetails(id: number) {
    return this.getDetails('tv', id);
  }

  getMovieDetails(id: number) {
    return this.getDetails('movie', id);
  }

  getPersonDetails(id: number) {
    return this.getDetails('person', id);
  }
}
