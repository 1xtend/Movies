import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MediaType } from '@app/shared/models/media.type';
import {
  IMoviesResponse,
  INowPlayingMoviesResponse,
} from '@app/shared/models/movie/movies-response.interface';
import { IPeopleResponse } from '@app/shared/models/person/people-response.interface';
import { ITVsResponse } from '@app/shared/models/tv/tvs-response.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ListsService {
  constructor(private http: HttpClient) {}

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
}
