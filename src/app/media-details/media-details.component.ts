import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { MediaType } from '@app/shared/models/media.type';
import { IDetailsMovie } from '@app/shared/models/movie/movie.interface';
import { IDetailsPerson } from '@app/shared/models/person/person.interface';
import { IDetailsTV } from '@app/shared/models/tv/tv.interface';
import { MediaService } from '@app/shared/services/media.service';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  Subject,
  combineLatest,
  switchMap,
  tap,
} from 'rxjs';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-media-details',
  templateUrl: './media-details.component.html',
  styleUrls: ['./media-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaDetailsComponent implements OnInit {
  private resSubject = new Subject<
    Partial<{ movie: IDetailsMovie; tv: IDetailsTV; person: IDetailsPerson }>
  >();
  res$ = this.resSubject.asObservable();

  private slidesSubject = new BehaviorSubject<number>(6);
  slides$ = this.slidesSubject.asObservable();

  private mediaType: MediaType = 'tv';
  private id: number = 0;
  language: string | undefined = undefined;

  readonly posterPath = environment.imagePaths.w500Poster;
  readonly backdropPath = environment.imagePaths.w1280Backdrop;
  readonly profilePath = environment.imagePaths.h632Profile;
  readonly original = environment.imagePaths.original;

  constructor(
    private route: ActivatedRoute,
    private mediaService: MediaService,
    private destroyRef: DestroyRef,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.paramsChanges();
    this.breakpointChanges();
  }

  private paramsChanges(): void {
    combineLatest({
      data: this.route.data,
      params: this.route.params,
      queryParams: this.route.queryParamMap,
    })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(({ data, params, queryParams }) => {
          this.mediaType = data['type'];
          this.language = queryParams.get('language') ?? undefined;
          this.id = params['id'];

          return this.fetchMedia();
        })
      )
      .subscribe();
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
          this.slidesSubject.next(6);
        }

        if (result.breakpoints['(max-width: 768px)']) {
          this.slidesSubject.next(5);
        }

        if (result.breakpoints['(max-width: 480px)']) {
          this.slidesSubject.next(4);
        }

        if (result.breakpoints['(min-width: 991px)']) {
          this.slidesSubject.next(8);
        }
      });
  }

  private fetchMedia(): Observable<
    IDetailsMovie | IDetailsPerson | IDetailsTV
  > {
    if (this.mediaType === 'movie') {
      return this.mediaService.getMovieDetails(this.id, this.language).pipe(
        tap((res) => {
          this.resSubject.next({ movie: res });
        })
      );
    }

    if (this.mediaType === 'tv') {
      return this.mediaService.getTVDetails(this.id, this.language).pipe(
        tap((res) => {
          this.resSubject.next({ tv: res });
        })
      );
    }

    if (this.mediaType === 'person') {
      return this.mediaService.getPersonDetails(this.id).pipe(
        tap((res) => {
          this.resSubject.next({ person: res });
        })
      );
    }

    return EMPTY;
  }
}
