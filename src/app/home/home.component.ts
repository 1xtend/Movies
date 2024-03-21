import { ListsService } from './../shared/services/media/lists.service';
import { SharedService } from '@app/shared/services/shared.service';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environment/environment';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  posterPath = environment.imagePaths.w500Poster;
  backdropPath = environment.imagePaths.w1280Backdrop;
  profilePath = environment.imagePaths.h632Profile;

  private slidesSubject = new BehaviorSubject<number>(6);
  slides$ = this.slidesSubject.asObservable();

  readonly textCut: number = 30;

  constructor(
    public sharedService: SharedService,
    private breakpointObserver: BreakpointObserver,
    private destroyRef: DestroyRef,
    private titleService: Title,
    public listsService: ListsService
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('VMTV: Place for Movies and TV Series');

    this.setMedia();

    this.breakpointChanges();
  }

  private setMedia(): void {
    this.listsService.setPopularPeople();
    this.listsService.setPopularMovies();
    this.listsService.setPopularTVs();
    this.listsService.setTopRatedMovies();
    this.listsService.setOnTheAirTVs();
    this.listsService.setNowPlayingMovies();
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
}
