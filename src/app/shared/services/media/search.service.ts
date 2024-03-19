import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IFilters } from '@app/shared/models/filters.interface';
import { MediaType } from '@app/shared/models/media.type';
import { IMoviesResponse } from '@app/shared/models/movie/movies-response.interface';
import { IPeopleResponse } from '@app/shared/models/person/people-response.interface';
import { ITVsResponse } from '@app/shared/models/tv/tvs-response.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(private http: HttpClient) {}

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
}
