import { SharedService } from '@app/shared/services/shared.service';
import { MediaService } from './../shared/services/media.service';
import { Component, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  map,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { IMoviesResponse } from '@app/shared/models/movie/movies-response.interface';
import { IMovie } from '@app/shared/models/movie/movie.interface';
import { environment } from 'src/environment/environment';
import { Platform } from '@angular/cdk/platform';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private popularMoviesSubject = new BehaviorSubject<
    IMoviesResponse | undefined
  >(undefined);
  // popularMovies$ = this.popularMoviesSubject.asObservable();
  popularMovies$?: Observable<IMoviesResponse>;

  posterPath = environment.imagePaths.original;
  backdropPath = environment.imagePaths.w1280Backdrop;
  profilePath = environment.imagePaths.h632Profile;

  constructor(
    private mediaService: MediaService,
    private sharedService: SharedService,
    private platform: Platform
  ) {}

  ngOnInit(): void {
    this.getPopularMovies();
  }

  private getPopularMovies(): void {
    this.popularMovies$ = this.sharedService.popularMovies$.pipe(
      take(1),
      switchMap((movies) => {
        if (movies && movies.results.length) {
          console.log('get saved');
          return of(movies);
        }

        return this.mediaService.getPopularMovies().pipe(
          tap((movies) => {
            console.log('get fetched');
            this.sharedService.setPopularMoviesSubject(movies);
          })
        );
      })
    );
  }
}
