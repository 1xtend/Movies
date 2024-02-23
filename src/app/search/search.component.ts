import { MediaService } from '../shared/services/media.service';
import { EMPTY, Subject, combineLatest, switchMap, takeUntil, tap } from 'rxjs';
import { SharedService } from './../shared/services/shared.service';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UnsubscribeAbstract } from '@app/shared/helpers/unsubscribe.abstract';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaType } from '@app/shared/models/media.type';
import { FormControl } from '@angular/forms';
import { IMediaFilters } from '@app/shared/models/filters.interface';
import { PageEvent } from '@angular/material/paginator';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { IMoviesResponse } from '@app/shared/models/movie/movies-response.interface';
import { ITVsResponse } from '@app/shared/models/tv/tvs-response.interface';
import { ISearchPeopleResponse } from '@app/shared/models/person/people-response.interface';
import { ITV } from '@app/shared/models/tv/tv.interface';
import { IMovie } from '@app/shared/models/movie/movie.interface';
import { IPerson } from '@app/shared/models/person/person.interface';
import { ISearchParams } from '@app/shared/models/params.interface';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent extends UnsubscribeAbstract implements OnInit {
  private resSubject = new Subject<
    Partial<{
      movies: IMoviesResponse;
      tvs: ITVsResponse;
      people: ISearchPeopleResponse;
    }>
  >();
  res$ = this.resSubject.asObservable();

  mediaType: MediaType = 'tv';
  mediaTypeControl = new FormControl<MediaType>(this.mediaType, {
    nonNullable: true,
  });

  filters: IMediaFilters = {
    page: 1,
    query: '',
  };

  private filtersSubject = new Subject<IMediaFilters>();
  filters$ = this.filtersSubject.asObservable();

  readonly pageSize = 20;
  noResult: boolean = false;

  constructor(
    private sharedService: SharedService,
    private mediaService: MediaService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.paramsChanges();

    this.searchChanges();
    this.mediaTypeChanges();
    this.filtersChanges();
  }

  private paramsChanges(): void {
    combineLatest({
      data: this.route.data,
      queryParams: this.route.queryParamMap,
    })
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        switchMap(({ data, queryParams }) => {
          if (!queryParams.has('q')) {
            return EMPTY;
          }

          const navigation = this.router.getCurrentNavigation();

          if (!navigation || navigation.trigger === 'popstate') {
            this.filters = {
              query: queryParams.get('q') || '',
              page: Number(queryParams.get('page')) || 1,
            };

            this.mediaType = data['type'];
            this.mediaTypeControl.setValue(this.mediaType, {
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

        this.sharedService.scrollToTop();
      });
  }

  private searchChanges(): void {
    this.sharedService.search$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((query) => {
        this.filtersSubject.next({
          query,
          page: 1,
        });
      });
  }

  private mediaTypeChanges(): void {
    this.sharedService.mediaType$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((type) => {
        this.mediaType = type;

        this.filtersSubject.next({
          ...this.filters,
          page: 1,
        });
      });
  }

  private filtersChanges(): void {
    this.filters$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((filters) => {
      this.filters = filters;

      this.setQueryParams();
    });
  }

  handleTabEvent(e: MatButtonToggleChange): void {
    this.sharedService.setMediaTypeSubject(e.value);
  }

  handlePageEvent(e: PageEvent): void {
    this.filtersSubject.next({
      ...this.filters,
      page: e.pageIndex + 1,
    });
  }

  mediaTrackBy(index: number, media: ITV | IMovie | IPerson) {
    return media.id;
  }

  private fetchMedia() {
    if (this.mediaType === 'tv') {
      return this.mediaService.searchTV(this.filters).pipe(
        tap((res) => {
          this.resSubject.next({ tvs: res });
        })
      );
    }

    if (this.mediaType === 'movie') {
      return this.mediaService.searchMovie(this.filters).pipe(
        tap((res) => {
          this.resSubject.next({ movies: res });
        })
      );
    }

    if (this.mediaType === 'person') {
      return this.mediaService.searchPeople(this.filters).pipe(
        tap((res) => {
          this.resSubject.next({ people: res });
        })
      );
    }

    return EMPTY;
  }

  private setQueryParams(): void {
    const params: ISearchParams = {
      q: this.filters.query,
      page: this.filters.page,
    };

    this.sharedService.setParams(params, '/search', this.mediaType);
  }
}
