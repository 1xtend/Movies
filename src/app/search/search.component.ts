import { MediaService } from '../shared/services/media.service';
import {
  EMPTY,
  Observable,
  Subject,
  first,
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
import { ITV } from '@app/shared/models/tv/tv.interface';
import { IMovie } from '@app/shared/models/movie/movie.interface';
import { IPerson } from '@app/shared/models/person/person.interface';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent extends UnsubscribeAbstract implements OnInit {
  private resSubject = new Subject<
    Partial<{
      movies: IMoviesResponse;
      tvs: ITVsResponse;
      people: IPeopleResponse;
    }>
  >();
  res$ = this.resSubject.asObservable();

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
            page: query ? 1 : queryParams['page'],
          };

          return this.fetchMedia();
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

          return this.fetchMedia();
        })
      )
      .subscribe((res) => {
        this.setQueryParams();
      });
  }

  handlePageEvent(e: PageEvent): void {
    this.filters.page = e.pageIndex + 1;

    this.fetchMedia().subscribe((res) => {
      this.setQueryParams();
    });
  }

  handleTabEvent(e: MatButtonToggleChange) {
    this.sharedService.setMediaTypeSubject(e.value);
  }

  private fetchMedia(): Observable<
    ITVsResponse | IMoviesResponse | IPeopleResponse
  > {
    if (this.mediaType === 'movie') {
      return this.mediaService.searchMovie(this.filters).pipe(
        tap((res) => {
          this.resSubject.next({ movies: res });
        })
      );
    }

    if (this.mediaType === 'tv') {
      return this.mediaService.searchTV(this.filters).pipe(
        tap((res) => {
          this.resSubject.next({ tvs: res });
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

  mediaTrackBy(index: number, media: ITV | IMovie | IPerson) {
    return media.id;
  }
}
