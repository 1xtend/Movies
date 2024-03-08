import { SharedService } from '@app/shared/services/shared.service';
import { MediaService } from './../shared/services/media.service';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
} from '@angular/core';
import { BehaviorSubject, Observable, of, switchMap, take, tap } from 'rxjs';
import { IMoviesResponse } from '@app/shared/models/movie/movies-response.interface';
import { environment } from 'src/environment/environment';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ITVsResponse } from '@app/shared/models/tv/tvs-response.interface';
import { IPeopleResponse } from '@app/shared/models/person/people-response.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  popularMovies$?: Observable<IMoviesResponse>;
  popularTVs$?: Observable<ITVsResponse>;
  popularPeople$?: Observable<IPeopleResponse>;

  posterPath = environment.imagePaths.w500Poster;
  backdropPath = environment.imagePaths.w1280Backdrop;
  profilePath = environment.imagePaths.h632Profile;

  private slidesSubject = new BehaviorSubject<number>(6);
  slides$ = this.slidesSubject.asObservable();

  readonly textCut: number = 30;

  constructor(
    private mediaService: MediaService,
    private sharedService: SharedService,
    private breakpointObserver: BreakpointObserver,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.getPopularMovies();
    this.getPopularTVs();
    this.getPopularPeople();
    this.breakpointChanges();
  }

  private breakpointChanges(): void {
    this.breakpointObserver
      .observe([
        '(max-width: 991px)',
        '(max-width: 768px)',
        '(max-width: 480px)',
        '(min-width: 991px)',
      ])
      .pipe(takeUntilDestroyed(this.destroyRef))
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
          return of(movies);
        }

        return this.mediaService.getPopularMovies().pipe(
          tap((movies) => {
            this.sharedService.setPopularMoviesSubject(movies);
          })
        );
      })
    );
  }

  private getPopularTVs(): void {
    this.popularTVs$ = this.sharedService.popularTVs$.pipe(
      take(1),
      switchMap((tvs) => {
        if (tvs && tvs.results.length) {
          return of(tvs);
        }

        return this.mediaService.getPopularTVs().pipe(
          tap((tvs) => {
            this.sharedService.setPopularTVsSubject(tvs);
          })
        );
      })
    );
  }

  private getPopularPeople(): void {
    this.popularPeople$ = this.sharedService.popularPeople$.pipe(
      take(1),
      switchMap((people) => {
        if (people && people.results.length) {
          return of(people);
        }

        return this.mediaService.getPopularPeople().pipe(
          tap((people) => {
            this.sharedService.setPopularPeopleSubject(people);
          })
        );
      })
    );
  }
}
