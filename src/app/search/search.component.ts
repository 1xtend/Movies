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

  mediaType: MediaType = 'tv';
  mediaTypeControl = new FormControl(this.mediaType, {
    nonNullable: true,
  });

  filters: IMediaFilters = {
    page: 1,
    query: '',
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
    this.paramsChanges();

    this.searchChanges();
    this.mediaTypeChanges();
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
          };

          this.mediaType = data['type'];
          this.mediaTypeControl.setValue(this.mediaType);

          return this.fetchMedia();
        })
      )
      .subscribe((res) => {
        this.sharedService.scrollToTop();
      });
  }

  private searchChanges(): void {
    this.sharedService.search$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((query) => {
        this.setQueryParams(query, 1, this.mediaType);
      });
  }

  private mediaTypeChanges(): void {
    this.sharedService.mediaType$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((type) => {
        this.setQueryParams(this.filters.query, 1, type);
      });
  }

  handleTabEvent(e: MatButtonToggleChange): void {
    this.sharedService.setMediaTypeSubject(e.value);
  }

  handlePageEvent(e: PageEvent): void {
    const page = e.pageIndex + 1;

    this.setQueryParams(this.filters.query, page, this.mediaType);
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

  private setQueryParams(q: string, page: number, mediaType: MediaType): void {
    this.router.navigate(['/search', mediaType], {
      queryParams: {
        q,
        page,
      },
    });
  }
}
