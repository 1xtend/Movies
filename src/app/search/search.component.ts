import { MediaService } from '../shared/services/media.service';
import {
  EMPTY,
  Observable,
  Subject,
  combineLatest,
  first,
  map,
  skip,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { SharedService } from './../shared/services/shared.service';
import { Component, OnInit } from '@angular/core';
import { UnsubscribeAbstract } from '@app/shared/helpers/unsubscribe.abstract';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaType } from '@app/shared/models/media.type';
import { FormControl } from '@angular/forms';
import { IMediaFilters } from '@app/shared/models/media-filters.interface';
import { PageEvent } from '@angular/material/paginator';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { ISearchMoviesResponse } from '@app/shared/models/movie/movies-response.interface';
import { ISearchTVsResponse } from '@app/shared/models/tv/tvs-response.interface';
import { ISearchPeopleResponse } from '@app/shared/models/person/people-response.interface';
import { ISearchTV } from '@app/shared/models/tv/tv.interface';
import { ISearchMovie } from '@app/shared/models/movie/movie.interface';
import { ISearchPerson } from '@app/shared/models/person/person.interface';
import { HttpParams } from '@angular/common/http';
import { ISearchParams } from '@app/shared/models/search-params.interface';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent extends UnsubscribeAbstract implements OnInit {
  private resSubject = new Subject<
    Partial<{
      movies: ISearchMoviesResponse;
      tvs: ISearchTVsResponse;
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
    includeAdult: undefined,
    year: undefined,
  };

  readonly pageSize = 20;
  noResult: boolean = false;

  tabletView: boolean = false;

  constructor(
    private sharedService: SharedService,
    private mediaService: MediaService,
    private route: ActivatedRoute,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {
    super();
  }

  ngOnInit(): void {
    this.paramsChanges();

    this.searchChanges();
    this.mediaTypeChanges();
    this.pageResize();
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

          this.filters = {
            query: queryParams.get('q') || '',
            page: Number(queryParams.get('page')) || 1,
            includeAdult:
              Boolean(queryParams.get('include_adult')) || undefined,
          };

          this.mediaType = data['type'];
          this.mediaTypeControl.setValue(this.mediaType);

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
        const filters: IMediaFilters = {
          query,
          page: 1,
        };

        this.setQueryParams(filters, this.mediaType);
      });
  }

  private mediaTypeChanges(): void {
    this.sharedService.mediaType$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((type) => {
        const filters: IMediaFilters = {
          ...this.filters,
          page: 1,
        };

        this.setQueryParams(filters, type);
      });
  }

  private pageResize(): void {
    this.breakpointObserver.observe(['(max-width: 767px)']).subscribe((res) => {
      console.log(res);
      this.tabletView = res.breakpoints['(max-width: 767px)'];
    });
  }

  handleTabEvent(e: MatButtonToggleChange): void {
    this.sharedService.setMediaTypeSubject(e.value);
  }

  handlePageEvent(e: PageEvent): void {
    const filters: IMediaFilters = {
      ...this.filters,
      page: e.pageIndex + 1,
    };

    this.setQueryParams(filters, this.mediaType);
  }

  mediaTrackBy(index: number, media: ISearchTV | ISearchMovie | ISearchPerson) {
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

  private setQueryParams(filters: IMediaFilters, mediaType: MediaType): void {
    const params: ISearchParams = {
      q: filters.query,
      page: filters.page,
    };

    if (filters.includeAdult !== undefined) {
      params.include_adult = filters.includeAdult;
    }

    if (filters.year) {
      params.year = filters.year;
    }

    this.router.navigate(['/search', mediaType], {
      queryParams: params,
    });
  }
}
