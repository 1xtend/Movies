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
  takeUntil,
  tap,
} from 'rxjs';
import { IMoviesResponse } from '@app/shared/models/movie/movies-response.interface';
import { IMovie } from '@app/shared/models/movie/movie.interface';
import { environment } from 'src/environment/environment';
import { Platform } from '@angular/cdk/platform';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { UnsubscribeAbstract } from '@app/shared/helpers/unsubscribe.abstract';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent extends UnsubscribeAbstract implements OnInit {
  private popularMoviesSubject = new BehaviorSubject<
    IMoviesResponse | undefined
  >(undefined);
  // popularMovies$ = this.popularMoviesSubject.asObservable();
  popularMovies$?: Observable<IMoviesResponse>;

  posterPath = environment.imagePaths.original;
  backdropPath = environment.imagePaths.w1280Backdrop;
  profilePath = environment.imagePaths.h632Profile;

  slidesValue: number = 5;

  constructor(
    private mediaService: MediaService,
    private sharedService: SharedService,
    private breakpointObserver: BreakpointObserver
  ) {
    super();
  }

  ngOnInit(): void {
    this.getPopularMovies();
    this.resize();
  }

  private resize(): void {
    this.breakpointObserver
      .observe([
        '(min-width: 768px)',
        '(max-width: 768px)',
        '(max-width: 500px)',
      ])
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((result: BreakpointState) => {
        if (result.breakpoints['(max-width: 768px)']) {
          this.slidesValue = 3;
        }

        if (result.breakpoints['(max-width: 500px)']) {
          this.slidesValue = 2;
        }

        if (result.breakpoints['(min-width: 768px)']) {
          this.slidesValue = 5;
        }
      });
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
