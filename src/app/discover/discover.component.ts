import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { sortBy } from '@app/shared/helpers/sort-by';
import { ISortBy } from '@app/shared/models/sort-by.type';
import { IFilters } from '@app/shared/models/filters.interface';
import { IGenre } from '@app/shared/models/genres.interface';
import { MediaType } from '@app/shared/models/media.type';
import { IMovie } from '@app/shared/models/movie/movie.interface';
import { IMoviesResponse } from '@app/shared/models/movie/movies-response.interface';
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
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  of,
  skip,
  startWith,
  switchMap,
  take,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiscoverComponent implements OnInit {
  private resSubject = new Subject<
    Partial<{
      movies: IMoviesResponse;
      tvs: ITVsResponse;
    }>
  >();
  res$ = this.resSubject.asObservable();

  // Filters
  mediaType: Exclude<MediaType, 'person'> = 'tv';
  filters: IFilters = {
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

  voteMinControl = new FormControl<number>(0, {
    nonNullable: true,
    validators: [Validators.min(0), Validators.max(10)],
  });
  voteMaxControl = new FormControl<number>(10, {
    nonNullable: true,
    validators: [Validators.min(0), Validators.max(10)],
  });

  yearControl = new FormControl<number | null>(null, {
    validators: [
      Validators.min(1000),
      Validators.max(9999),
      Validators.pattern('^[0-9]*$'),
    ],
  });

  // States
  private filtersSubject = new Subject<IFilters>();
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
  private readonly debounceTime = this.sharedService.fetchDebounceTime;

  constructor(
    private route: ActivatedRoute,
    private mediaService: MediaService,
    private router: Router,
    public sharedService: SharedService,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.paramsChanges();

    this.genresChanges();
    this.sortByChanges();
    this.includeAdultChanges();
    this.languageChanges();
    this.voteAverageChanges();
    this.yearChanges();

    this.filtersChanges();
  }

  private paramsChanges(): void {
    combineLatest({
      data: this.route.data,
      queryParams: this.route.queryParamMap,
    })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
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
              include_adult: JSON.parse(
                queryParams.get('include_adult') || 'false'
              ),
              language: queryParams.get('language') || undefined,
              'vote_average.gte':
                Number(queryParams.get('vote_average.gte')) || undefined,
              'vote_average.lte':
                Number(queryParams.get('vote_average.lte')) || undefined,
              first_air_date_year:
                Number(queryParams.get('first_air_date_year')) || undefined,
              primary_release_year:
                Number(queryParams.get('primary_release_year')) || undefined,
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

            this.voteMinControl.setValue(
              this.filters['vote_average.gte'] ?? 0,
              { emitEvent: false }
            );

            this.voteMaxControl.setValue(
              this.filters['vote_average.lte'] ?? 10,
              { emitEvent: false }
            );

            this.yearControl.setValue(
              (this.filters.primary_release_year ||
                this.filters.first_air_date_year) ??
                null,
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

        this.sharedService.scrollToTop();
      });
  }

  private filtersChanges(): void {
    this.filters$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((filters) => {
        this.filters = filters;

        this.setQueryParams();
      });
  }

  private genresChanges(): void {
    this.fetchGenres()
      .pipe(
        switchMap((genres) => {
          this.genresListSubject.next(genres);

          return this.genreControl.valueChanges.pipe(
            takeUntilDestroyed(this.destroyRef)
          );
        }),
        debounceTime(this.debounceTime)
      )
      .subscribe((genres) => {
        this.filtersSubject.next({
          ...this.filters,
          with_genres: genres.length ? genres.join(',') : undefined,
          page: 1,
        });
      });
  }

  private sortByChanges(): void {
    this.sortByControl.valueChanges
      .pipe(
        debounceTime(this.debounceTime),
        takeUntilDestroyed(this.destroyRef)
      )
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
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(this.debounceTime)
      )
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
            takeUntilDestroyed(this.destroyRef)
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

  private voteAverageChanges(): void {
    combineLatest([
      this.voteMinControl.valueChanges.pipe(startWith(null)),
      this.voteMaxControl.valueChanges.pipe(startWith(null)),
    ])
      .pipe(
        skip(1),
        map(([min, max]) => {
          return [min === null ? 0 : min, max === null ? 10 : max];
        }),
        debounceTime(this.debounceTime),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(([min, max]) => {
        this.filtersSubject.next({
          ...this.filters,
          'vote_average.gte': min,
          'vote_average.lte': max,
        });
      });
  }

  private yearChanges(): void {
    this.yearControl.valueChanges
      .pipe(
        debounceTime(this.debounceTime),
        distinctUntilChanged(),
        filter(() => this.yearControl.valid),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((year) => {
        this.filtersSubject.next({
          ...this.filters,
          page: 1,
          [this.mediaType === 'movie'
            ? 'primary_release_year'
            : 'first_air_date_year']: year,
        });
      });
  }

  private fetchLanguages() {
    return this.sharedService.languages$.pipe(
      take(1),
      switchMap((languages) => {
        if (languages.length) {
          // Get saved languages
          return of(languages);
        }

        // Get fetched languages
        return this.mediaService.getLanguages().pipe(
          tap((languages) => {
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
          // Get saved genres
          return of(currentGenres);
        }

        return this.mediaService.getGenres(this.mediaType).pipe(
          map((res) => {
            this.sharedService.setGenresSubject(res.genres, this.mediaType);

            // Get fetched genres
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
    const params: IFilters = this.filters;

    this.sharedService.setParams(params, '/discover', this.mediaType);
  }

  mediaTrackBy(index: number, media: ITV | IMovie | IPerson) {
    return media.id;
  }
}
