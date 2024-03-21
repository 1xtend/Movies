import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MediaType } from '@app/shared/models/media.type';
import {
  IMoviesResponse,
  INowPlayingMoviesResponse,
} from '@app/shared/models/movie/movies-response.interface';
import { IPeopleResponse } from '@app/shared/models/person/people-response.interface';
import { ITVsResponse } from '@app/shared/models/tv/tvs-response.interface';
import { BehaviorSubject, Observable, of, switchMap, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ListsService {
  private popularMoviesSubject = new BehaviorSubject<
    IMoviesResponse | undefined
  >(undefined);
  popularMovies$ = this.popularMoviesSubject.asObservable();

  private popularTVsSubject = new BehaviorSubject<ITVsResponse | undefined>(
    undefined
  );
  popularTVs$ = this.popularTVsSubject.asObservable();

  private popularPeopleSubject = new BehaviorSubject<
    IPeopleResponse | undefined
  >(undefined);
  popularPeople$ = this.popularPeopleSubject.asObservable();

  private nowPlayingMoviesSubject = new BehaviorSubject<
    INowPlayingMoviesResponse | undefined
  >(undefined);
  nowPlayingMovies$ = this.nowPlayingMoviesSubject.asObservable();

  private topRatedMoviesSubject = new BehaviorSubject<
    IMoviesResponse | undefined
  >(undefined);
  topRatedMovies$ = this.topRatedMoviesSubject.asObservable();

  private onTheAirTVsSubject = new BehaviorSubject<ITVsResponse | undefined>(
    undefined
  );
  onTheAirTV$ = this.onTheAirTVsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Popular
  private getPopular<T>(mediaType: MediaType): Observable<T> {
    return this.http.get<T>(`/${mediaType}/popular`);
  }

  getPopularMovies(): Observable<IMoviesResponse> {
    return this.getPopular<IMoviesResponse>('movie');
  }

  getPopularTVs(): Observable<ITVsResponse> {
    return this.getPopular<ITVsResponse>('tv');
  }

  getPopularPeople(): Observable<IPeopleResponse> {
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

  // State functions
  setPopularMovies(): void {
    this.popularMovies$
      .pipe(
        take(1),
        switchMap((movies) => {
          if (movies && movies.results.length) {
            // Get saved movies
            return of(movies);
          }

          // Get fetched movies
          return this.getPopularMovies().pipe(
            tap((movies) => {
              this.popularMoviesSubject.next(movies);
            })
          );
        })
      )
      .subscribe();
  }

  setPopularTVs(): void {
    this.popularTVs$
      .pipe(
        take(1),
        switchMap((tvs) => {
          if (tvs && tvs.results.length) {
            // Get saved tv series
            return of(tvs);
          }

          // Get fetched tv series
          return this.getPopularTVs().pipe(
            tap((tvs) => {
              this.popularTVsSubject.next(tvs);
            })
          );
        })
      )
      .subscribe();
  }

  setPopularPeople(): void {
    this.popularPeople$
      .pipe(
        take(1),
        switchMap((people) => {
          if (people && people.results.length) {
            // Get saved people
            return of(people);
          }

          // Get fetched people
          return this.getPopularPeople().pipe(
            tap((people) => {
              this.popularPeopleSubject.next(people);
            })
          );
        })
      )
      .subscribe();
  }

  setNowPlayingMovies(): void {
    this.nowPlayingMovies$
      .pipe(
        take(1),
        switchMap((movies) => {
          if (movies && movies.results.length) {
            // Get saved movies
            return of(movies);
          }

          // Get fetched movies
          return this.getNowPlayingMovies().pipe(
            tap((movies) => {
              this.nowPlayingMoviesSubject.next(movies);
            })
          );
        })
      )
      .subscribe();
  }

  setTopRatedMovies(): void {
    this.topRatedMovies$
      .pipe(
        take(1),
        switchMap((movies) => {
          if (movies && movies.results.length) {
            // Get saved movies
            return of(movies);
          }

          // Get fetched movies
          return this.getTopRatedMovies().pipe(
            tap((movies) => {
              this.topRatedMoviesSubject.next(movies);
            })
          );
        })
      )
      .subscribe();
  }

  setOnTheAirTVs(): void {
    this.onTheAirTV$
      .pipe(
        take(1),
        switchMap((tvs) => {
          if (tvs && tvs.results.length) {
            // Get saved tv series
            return of(tvs);
          }

          // Get fetched tv series
          return this.getOnTheAirTV().pipe(
            tap((tvs) => {
              this.onTheAirTVsSubject.next(tvs);
            })
          );
        })
      )
      .subscribe();
  }
}
