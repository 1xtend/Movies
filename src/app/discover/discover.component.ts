import { getMultipleValuesInSingleSelectionError } from '@angular/cdk/collections';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewInit,
  Component,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import {
  ActivatedRoute,
  NavigationEnd,
  NavigationStart,
  Router,
} from '@angular/router';
import { UnsubscribeAbstract } from '@app/shared/helpers/unsubscribe.abstract';
import { IDiscoverFilters } from '@app/shared/models/filters.interface';
import { IGenre, SavedGenresType } from '@app/shared/models/genres.interface';
import { MediaType } from '@app/shared/models/media.type';
import { IMovie } from '@app/shared/models/movie/movie.interface';
import { ISearchMoviesResponse } from '@app/shared/models/movie/movies-response.interface';
import { IDiscoverParams } from '@app/shared/models/params.interface';
import { ISearchPeopleResponse } from '@app/shared/models/person/people-response.interface';
import { IPerson } from '@app/shared/models/person/person.interface';
import { SortByType } from '@app/shared/models/sort-by.type';
import { ITV } from '@app/shared/models/tv/tv.interface';
import { ISearchTVsResponse } from '@app/shared/models/tv/tvs-response.interface';
import { MediaService } from '@app/shared/services/media.service';
import { SharedService } from '@app/shared/services/shared.service';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  ReplaySubject,
  Subject,
  combineLatest,
  concatMap,
  debounceTime,
  defaultIfEmpty,
  distinctUntilChanged,
  filter,
  generate,
  map,
  of,
  shareReplay,
  skip,
  startWith,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss'],
})
export class DiscoverComponent extends UnsubscribeAbstract implements OnInit {
  private resSubject = new Subject<
    Partial<{
      movies: ISearchMoviesResponse;
      tvs: ISearchTVsResponse;
    }>
  >();
  res$ = this.resSubject.asObservable();

  mediaType: Exclude<MediaType, 'person'> = 'tv';

  noResult: boolean = false;

  private filtersSubject = new Subject<IDiscoverFilters>();
  filters$ = this.filtersSubject.asObservable();

  filters: IDiscoverFilters = {
    page: 1,
    sort_by: 'popularity.desc',
  };

  genreControl = new FormControl<string[]>([], {
    nonNullable: true,
  });

  private genresListSubject = new ReplaySubject<IGenre[]>();
  genresList$ = this.genresListSubject.asObservable();

  readonly pageSize = 20;

  constructor(
    private route: ActivatedRoute,
    private mediaService: MediaService,
    private router: Router,
    private sharedService: SharedService
  ) {
    super();
  }

  ngOnInit(): void {
    this.paramsChanges();
    this.genresChanges();
    this.filtersChanges();
  }

  private paramsChanges(): void {
    combineLatest({
      data: this.route.data,
      queryParams: this.route.queryParamMap,
    })
      .pipe(
        switchMap(({ data, queryParams }) => {
          const navigation = this.router.getCurrentNavigation();

          if (!navigation || navigation.trigger === 'popstate') {
            this.filters = {
              page: Number(queryParams.get('page')) || 1,
              sort_by:
                (queryParams.get('sort_by') as SortByType) || 'popularity.desc',
              with_genres: queryParams.get('with_genres') || undefined,
              year: Number(queryParams.get('year')) || undefined,
            };

            this.mediaType = data['type'];

            this.genreControl.setValue(
              this.filters.with_genres
                ? this.filters.with_genres.split(',')
                : [],
              { emitEvent: false }
            );
          }

          return this.fetchMedia();
        })
      )
      .subscribe((res) => {
        if (!res || !res.total_results) {
          this.noResult = true;
        } else {
          this.noResult = false;
        }

        console.log('Params changes');

        this.sharedService.scrollToTop();
      });
  }

  private filtersChanges(): void {
    this.filters$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((filters) => {
      this.filters = filters;

      console.log('Filters changes');
      this.setQueryParams(this.filters, this.mediaType);
    });
  }

  private genresChanges(): void {
    this.fetchGenres()
      .pipe(
        switchMap((genres) => {
          this.genresListSubject.next(genres);

          return this.genreControl.valueChanges.pipe(
            takeUntil(this.ngUnsubscribe$)
          );
        }),
        debounceTime(1000)
      )
      .subscribe((genres) => {
        this.filters = {
          ...this.filters,
          with_genres: genres.length ? genres.join(',') : undefined,
          page: 1,
        };

        console.log('Genres changes');

        this.setQueryParams(this.filters, this.mediaType);
      });
  }

  private fetchGenres(): Observable<IGenre[]> {
    return this.sharedService.genres$.pipe(
      take(1),
      switchMap((genres) => {
        const currentGenres = genres[this.mediaType];

        if (currentGenres && currentGenres.length) {
          return of(currentGenres);
        }

        return this.mediaService.getGenres(this.mediaType).pipe(
          map((res) => {
            this.sharedService.setGenresSubject(res.genres, this.mediaType);

            return res.genres;
          })
        );
      })
    );
  }

  private fetchMedia(): Observable<ISearchTVsResponse | ISearchMoviesResponse> {
    if (this.mediaType === 'tv') {
      return this.mediaService.discoverTVs(this.filters).pipe(
        tap((res) => {
          this.resSubject.next({ tvs: res });
        })
      );
    }

    if (this.mediaType === 'movie') {
      return this.mediaService.discoverMovies(this.filters).pipe(
        tap((res) => {
          this.resSubject.next({ movies: res });
        })
      );
    }

    return EMPTY;
  }

  handlePageEvent(e: PageEvent): void {
    this.filtersSubject.next({
      ...this.filters,
      page: e.pageIndex + 1,
    });
  }

  private setQueryParams(
    filters: IDiscoverFilters,
    mediaType: MediaType
  ): void {
    const params: IDiscoverParams = {
      ...filters,
    };

    this.sharedService.setParams(params, '/discover', mediaType);
  }

  mediaTrackBy(index: number, media: ITV | IMovie | IPerson) {
    return media.id;
  }
}
