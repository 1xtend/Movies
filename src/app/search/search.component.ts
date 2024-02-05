import { MediaService } from '../shared/services/media.service';
import {
  EMPTY,
  Observable,
  Subject,
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
import { IPeopleResponse } from '@app/shared/models/person/people-response.interface';
import { IMoviesResponse } from '@app/shared/models/movie/movies-response.interface';
import { ITVsResponse } from '@app/shared/models/tv/tvs-response.interface';
import { PageEvent } from '@angular/material/paginator';
import { MatButtonToggleChange } from '@angular/material/button-toggle';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent extends UnsubscribeAbstract implements OnInit {
  private responseSubject = new Subject<
    Partial<{
      movies: IMoviesResponse;
      tvs: ITVsResponse;
      people: IPeopleResponse;
    }>
  >();
  response$ = this.responseSubject.asObservable();

  mediaType: MediaType = this.route.snapshot.params['media-type'];
  mediaTypeControl = new FormControl<MediaType | null>(this.mediaType, {
    nonNullable: true,
  });

  filters: IMediaFilters = {
    query: '',
    page: 1,
  };

  readonly pageSize = 20;

  constructor(
    private sharedService: SharedService,
    private mediaService: MediaService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.mediaTypeChanges();
    this.searchChanges();
  }

  private searchChanges(): void {
    this.sharedService.search$
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        switchMap((query) => {
          const queryParams = this.route.snapshot.queryParams;

          this.filters = {
            query: query || queryParams['q'],
            page: queryParams['page'] || 1,
          };

          return this.fetchMedia(this.filters);
        })
      )
      .subscribe((res) => {
        this.setQueryParams();
      });
  }

  private mediaTypeChanges() {
    this.sharedService.mediaType$
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        switchMap((type) => {
          this.mediaType = type;
          this.filters.page = 1;

          return this.fetchMedia(this.filters);
        })
      )
      .subscribe((res) => {
        this.setQueryParams();
      });
  }

  handlePageEvent(e: PageEvent): void {
    this.filters.page = e.pageIndex + 1;

    this.fetchMedia(this.filters).subscribe((res) => {
      this.setQueryParams();
    });
  }

  handleTabEvent(e: MatButtonToggleChange) {
    this.sharedService.setMediaTypeSubject(e.value);
  }

  private fetchMedia(
    filters: IMediaFilters
  ): Observable<ITVsResponse | IMoviesResponse | IPeopleResponse> {
    if (this.mediaType === 'movie') {
      return this.mediaService.searchMovie(filters).pipe(
        tap((res) => {
          this.responseSubject.next({ movies: res });
        })
      );
    }

    if (this.mediaType === 'tv') {
      return this.mediaService.searchTV(filters).pipe(
        tap((res) => {
          this.responseSubject.next({ tvs: res });
        })
      );
    }

    if (this.mediaType === 'person') {
      return this.mediaService.searchPeople(filters).pipe(
        tap((res) => {
          this.responseSubject.next({ people: res });
        })
      );
    }

    return EMPTY;
  }

  private setQueryParams() {
    this.router.navigate(['/search', this.mediaType], {
      queryParams: {
        q: this.filters.query,
        page: this.filters.page,
      },
      replaceUrl: true,
      preserveFragment: true,
      relativeTo: this.route,
    });
  }
}
