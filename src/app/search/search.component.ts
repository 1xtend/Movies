import { LoadingService } from './../shared/services/loading.service';
import { MediaService } from '../shared/services/media.service';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  Subject,
  map,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { SharedService } from './../shared/services/shared.service';
import { Component, OnInit } from '@angular/core';
import { UnsubscribeAbstract } from '@app/shared/helpers/unsubscribe.abstract';
import { ActivatedRoute, Params, Route, Router } from '@angular/router';
import { MediaType } from '@app/shared/models/media.type';
import { FormControl } from '@angular/forms';
import { IMediaFilters } from '@app/shared/models/media-filters.interface';
import { IPeopleResponse } from '@app/shared/models/person/people-response.interface';
import { IPerson } from '@app/shared/models/person/person.interface';
import { IMoviesResponse } from '@app/shared/models/movie/movies-response.interface';
import { ITVsResponse } from '@app/shared/models/tv/tvs-response.interface';
import { PageEvent } from '@angular/material/paginator';

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
  mediaTypeControl = new FormControl<MediaType>(this.mediaType, {
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
    this.searchChanges();
    this.mediaTypeChanges();
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
        console.log('Search changes: ', res);
        // this.setQueryParams();
      });
  }

  private mediaTypeChanges() {
    this.mediaTypeControl.valueChanges
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        switchMap((type) => {
          this.mediaType = type;
          this.filters.page = 1;

          return this.fetchMedia(this.filters);
        })
      )
      .subscribe((res) => {
        console.log('Media type changes: ', res);

        this.setQueryParams();
      });
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

    console.log('Set query params: ', this.router.url);
  }

  handlePageEvent(e: PageEvent): void {
    console.log(e);

    this.filters.page = e.pageIndex + 1;

    this.fetchMedia(this.filters).subscribe((res) => {
      this.setQueryParams();
      console.log('Page event changes: ', res);
    });
  }
}
