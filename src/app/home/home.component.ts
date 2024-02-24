import { SharedService } from '@app/shared/services/shared.service';
import { MediaService } from './../shared/services/media.service';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  of,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { IMoviesResponse } from '@app/shared/models/movie/movies-response.interface';
import { environment } from 'src/environment/environment';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { UnsubscribeAbstract } from '@app/shared/helpers/unsubscribe.abstract';
import { ITVsResponse } from '@app/shared/models/tv/tvs-response.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent extends UnsubscribeAbstract implements OnInit {
  popularMovies$?: Observable<IMoviesResponse>;
  popularTVs$?: Observable<ITVsResponse>;
  popularPeople$?: Observable<ITVsResponse>;

  posterPath = environment.imagePaths.w500Poster;
  backdropPath = environment.imagePaths.w1280Backdrop;
  profilePath = environment.imagePaths.h632Profile;

  private slidesSubject = new BehaviorSubject<number>(6);
  slides$ = this.slidesSubject.asObservable();

  constructor(
    private mediaService: MediaService,
    private sharedService: SharedService,
    private breakpointObserver: BreakpointObserver
  ) {
    super();
  }

  ngOnInit(): void {
    this.getPopularMovies();
    this.getPopularTVs();
    this.resize();
  }

  private resize(): void {
    this.breakpointObserver
      .observe([
        '(max-width: 991px)',
        '(max-width: 768px)',
        '(max-width: 480px)',
        '(min-width: 991px)',
      ])
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((result: BreakpointState) => {
        if (result.breakpoints['(max-width: 991px)']) {
          this.slidesSubject.next(4);
        }

        if (result.breakpoints['(max-width: 768px)']) {
          this.slidesSubject.next(3);
        }

        if (result.breakpoints['(max-width: 480px)']) {
          this.slidesSubject.next(2);
        }

        if (result.breakpoints['(min-width: 991px)']) {
          this.slidesSubject.next(6);
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

  private getPopularTVs(): void {
    this.popularTVs$ = this.sharedService.popularTVs$.pipe(
      take(1),
      switchMap((tv) => {
        if (tv && tv.results.length) {
          console.log('get saved');
          return of(tv);
        }

        return this.mediaService.getPopularTVs().pipe(
          tap((tv) => {
            console.log('get fetched');
            this.sharedService.setPopularTVsSubject(tv);
          })
        );
      })
    );
  }
}
