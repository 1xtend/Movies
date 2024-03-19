import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IFilters } from '@app/shared/models/filters.interface';
import { MediaType } from '@app/shared/models/media.type';
import { IMoviesResponse } from '@app/shared/models/movie/movies-response.interface';
import { ITVsResponse } from '@app/shared/models/tv/tvs-response.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DiscoverService {
  constructor(private http: HttpClient) {}

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
}
