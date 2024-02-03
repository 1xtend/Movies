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
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MediaType } from '@app/shared/models/media.type';
import { FormControl } from '@angular/forms';
import { IMediaFilters } from '@app/shared/models/media-filters.interface';
import { IPeopleResponse } from '@app/shared/models/person/people-response.interface';
import { IPerson } from '@app/shared/models/person/person.interface';
import { IMovieResponse } from '@app/shared/models/movie/movie-response.interface';
import { ITVResponse } from '@app/shared/models/tv/tv-response.interface';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent extends UnsubscribeAbstract implements OnInit {
  private responseSubject = new Subject<
    Partial<{
      movies: IMovieResponse;
      tvs: ITVResponse;
      people: IPeopleResponse;
    }>
  >();
  response$ = this.responseSubject.asObservable();

  currentMediaType: MediaType = 'tv';
  mediaTypeControl = new FormControl<MediaType>(this.currentMediaType, {
    nonNullable: true,
  });

  readonly pageSize = 20;

  private filters: IMediaFilters = {
    query: '',
    page: 1,
  };

  constructor(
    private sharedService: SharedService,
    private mediaService: MediaService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.sharedService.setMediaFilters(this.filters);

    this.searchChanges();
    this.mediaTypeChanges();
    this.filtersChanges();
    this.setQuery();
  }

  private searchChanges(): void {
    this.sharedService.search$
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        switchMap((query) => {
          const params = this.activatedRoute.snapshot.queryParams;

          this.filters = {
            query: query || params['q'],
            page: params['page'] || 1,
          };

          console.log(this.filters.query, this.filters.page);

          return this.fetchMedia();
        })
      )
      .subscribe((res) => {
        console.log('End search: ', res);
        this.setQuery();
      });
  }

  private mediaTypeChanges() {
    this.mediaTypeControl.valueChanges
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        switchMap((type) => {
          this.currentMediaType = type;
          this.filters.page = 1;

          return this.fetchMedia();
        })
      )
      .subscribe((res) => {
        console.log(res);
        this.setQuery();
      });
  }

  private filtersChanges() {
    this.sharedService.mediaFilters$
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        switchMap((filters) => {
          this.filters = filters;

          console.log('Filtered');
          return this.fetchMedia();
        })
      )
      .subscribe((res) => {
        console.log('Filtered res: ', res);
        this.setQuery();
      });
  }

  handlePageEvent(event: PageEvent) {
    this.filters.page = event.pageIndex + 1;
    console.log(event);

    this.fetchMedia().subscribe((res) => {
      console.log(res);
      this.setQuery();
    });
  }

  private fetchMedia(): Observable<
    IMovieResponse | ITVResponse | IPeopleResponse
  > {
    if (this.currentMediaType === 'movie') {
      return this.mediaService.searchMovie(this.filters).pipe(
        tap((res) => {
          this.responseSubject.next({ movies: res });
        })
      );
    }

    if (this.currentMediaType === 'tv') {
      return this.mediaService.searchTV(this.filters).pipe(
        tap((res) => {
          this.responseSubject.next({ tvs: res });
        })
      );
    }

    if (this.currentMediaType === 'person') {
      return this.mediaService.searchPeople(this.filters).pipe(
        tap((res) => {
          this.responseSubject.next({ people: res });
        })
      );
    }

    return EMPTY;
  }

  private setQuery() {
    const queryParams: Params = {
      q: this.filters.query,
      page: this.filters.page,
    };

    this.router.navigate(['search/', this.currentMediaType], {
      queryParams,
      replaceUrl: true,
      preserveFragment: true,
    });
  }
}
