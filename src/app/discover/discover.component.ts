import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { ISortBy, sortBy } from '@app/shared/helpers/sort-by';
import { UnsubscribeAbstract } from '@app/shared/helpers/unsubscribe.abstract';
import { IDiscoverFilters } from '@app/shared/models/filters.interface';
import { IGenre } from '@app/shared/models/genres.interface';
import { MediaType } from '@app/shared/models/media.type';
import { IMovie } from '@app/shared/models/movie/movie.interface';
import { IMoviesResponse } from '@app/shared/models/movie/movies-response.interface';
import { IDiscoverParams } from '@app/shared/models/params.interface';
import { IPerson } from '@app/shared/models/person/person.interface';
import { MovieSortByType, TVSortByType } from '@app/shared/models/sort-by.type';
import { ITV } from '@app/shared/models/tv/tv.interface';
import { ITVsResponse } from '@app/shared/models/tv/tvs-response.interface';
import { MediaService } from '@app/shared/services/media.service';
import { SharedService } from '@app/shared/services/shared.service';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  ReplaySubject,
  Subject,
  catchError,
  combineLatest,
  concatMap,
  debounceTime,
  defaultIfEmpty,
  distinctUntilChanged,
  filter,
  finalize,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiscoverComponent extends UnsubscribeAbstract implements OnInit {
  private resSubject = new Subject<
    Partial<{
      movies: IMoviesResponse;
      tvs: ITVsResponse;
    }>
  >();
  res$ = this.resSubject.asObservable();

  // Filters
  mediaType: Exclude<MediaType, 'person'> = 'tv';
  filters: IDiscoverFilters = {
    page: 1,
    sort_by: 'popularity.desc',
    include_adult: false,
  };

  // Form controls
  genreControl = new FormControl<string[]>([], {
    nonNullable: true,
  });

  sortByControl = new FormControl<MovieSortByType | TVSortByType>(
    'popularity.desc',
    { nonNullable: true }
  );

  includeAdultControl = new FormControl<boolean>(this.filters.include_adult, {
    nonNullable: true,
  });

  languageControl = new FormControl<string>('', {
    nonNullable: true,
  });

  // States
  private filtersSubject = new Subject<IDiscoverFilters>();
  filters$ = this.filtersSubject.asObservable();

  private genresListSubject = new ReplaySubject<IGenre[]>();
  genresList$ = this.genresListSubject.asObservable();

  private sortByListSubject = new BehaviorSubject<
    ISortBy<MovieSortByType | TVSortByType>[]
  >([]);
  sortByList$ = this.sortByListSubject.asObservable();

  // Other
  readonly pageSize = 20;
  noResult: boolean = false;
  private readonly debounceTime = 1000;

  constructor(
    private route: ActivatedRoute,
    private mediaService: MediaService,
    private router: Router,
    public sharedService: SharedService
  ) {
    super();
  }

  ngOnInit(): void {
    this.paramsChanges();

    this.genresChanges();
    this.sortByChanges();
    this.includeAdultChanges();
    this.languageChanges();

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
                (queryParams.get('sort_by') as
                  | MovieSortByType
                  | TVSortByType) || 'popularity.desc',
              with_genres: queryParams.get('with_genres') || undefined,
              year: Number(queryParams.get('year')) || undefined,
              include_adult: JSON.parse(
                queryParams.get('include_adult') ?? 'false'
              ),
              language: queryParams.get('language') || undefined,
            };

            this.mediaType = data['type'];

            this.genreControl.setValue(
              this.filters.with_genres
                ? this.filters.with_genres.split(',')
                : [],
              { emitEvent: false }
            );

            this.sortByListSubject.next(sortBy[this.mediaType]);

            this.sortByControl.setValue(
              this.filters.sort_by ?? 'popularity.desc',
              { emitEvent: false }
            );

            this.includeAdultControl.setValue(
              this.filters.include_adult ?? false,
              { emitEvent: false }
            );

            this.languageControl.setValue(this.filters.language ?? 'xx', {
              emitEvent: false,
            });
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
      this.setQueryParams();
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
        debounceTime(this.debounceTime)
      )
      .subscribe((genres) => {
        console.log('Genres changes');

        this.filtersSubject.next({
          ...this.filters,
          with_genres: genres.length ? genres.join(',') : undefined,
          page: 1,
        });
      });
  }

  private sortByChanges(): void {
    this.sortByControl.valueChanges
      .pipe(debounceTime(this.debounceTime), takeUntil(this.ngUnsubscribe$))
      .subscribe((value) => {
        this.filtersSubject.next({
          ...this.filters,
          sort_by: value,
          page: 1,
        });
      });
  }

  private includeAdultChanges(): void {
    this.includeAdultControl.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe$), debounceTime(this.debounceTime))
      .subscribe((include) => {
        this.filtersSubject.next({
          ...this.filters,
          include_adult: include,
        });
      });
  }

  private languageChanges(): void {
    this.fetchLanguages()
      .pipe(
        switchMap(() => {
          return this.languageControl.valueChanges.pipe(
            takeUntil(this.ngUnsubscribe$)
          );
        }),
        debounceTime(this.debounceTime)
      )
      .subscribe((language) => {
        this.filtersSubject.next({
          ...this.filters,
          language,
          page: 1,
        });
      });
  }

  private fetchLanguages() {
    return this.sharedService.languages$.pipe(
      take(1),
      switchMap((languages) => {
        if (languages.length) {
          console.log('Saved languages: ', languages);
          return of(languages);
        }

        return this.mediaService.getLanguages().pipe(
          tap((languages) => {
            console.log('Fetched languages: ', languages);

            this.sharedService.setLanguagesSubject(languages);
          })
        );
      })
    );
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

  private fetchMedia(): Observable<ITVsResponse | IMoviesResponse> {
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

  private setQueryParams(): void {
    const params: IDiscoverParams = {
      ...this.filters,
    };

    this.sharedService.setParams(params, '/discover', this.mediaType);
  }

  mediaTrackBy(index: number, media: ITV | IMovie | IPerson) {
    return media.id;
  }
}
