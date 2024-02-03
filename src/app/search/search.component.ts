import { LoadingService } from './../shared/services/loading.service';
import { MediaService } from '../shared/services/media.service';
import {
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
import { ActivatedRoute } from '@angular/router';
import { MediaType } from '@app/shared/models/media.enum';
import { FormControl } from '@angular/forms';
import { IMediaFilters } from '@app/shared/models/media-filters.interface';
import { IPeopleResponse } from '@app/shared/models/person/people-response.interface';
import { IPerson } from '@app/shared/models/person/person.interface';
import { IMovieResponse } from '@app/shared/models/movie/movie-response.interface';
import { ITVResponse } from '@app/shared/models/tv/tv-response.interface';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent extends UnsubscribeAbstract implements OnInit {
  // response?: IShowsResponse | IPeopleResponse;
  movies?: IMovieResponse;
  tvs?: ITVResponse;
  people?: IPeopleResponse;

  private currentMediaType: MediaType = MediaType.TV;
  mediaTypeControl = new FormControl<MediaType>(this.currentMediaType, {
    nonNullable: true,
  });

  private filters: IMediaFilters = {
    query: '',
    page: 1,
  };

  constructor(
    private sharedService: SharedService,
    private mediaService: MediaService,
    private activatedRoute: ActivatedRoute
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
          const params = this.activatedRoute.snapshot.queryParams;

          this.filters.query = query || params['q'];
          this.filters.page = params['page'] || 1;

          console.log(this.filters.query);

          return this.fetchMedia();
        })
      )
      .subscribe((res) => {
        console.log('End search: ', res);
      });
  }

  private mediaTypeChanges() {
    this.mediaTypeControl.valueChanges
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        switchMap((type) => {
          this.currentMediaType = type;

          return this.fetchMedia();
        })
      )
      .subscribe((res) => {});
  }

  private fetchMedia(): Observable<
    IMovieResponse | ITVResponse | IPeopleResponse
  > {
    if (this.currentMediaType === MediaType.MOVIE) {
      return this.mediaService.searchMovie(this.filters).pipe(
        tap((res) => {
          this.movies = res;
        })
      );
    }

    if (this.currentMediaType === MediaType.TV) {
      return this.mediaService.searchTV(this.filters).pipe(
        tap((res) => {
          this.tvs = res;
        })
      );
    }

    if (this.currentMediaType === MediaType.PERSON) {
      return this.mediaService.searchPeople(this.filters).pipe(
        tap((res) => {
          this.people = res;
        })
      );
    }

    return EMPTY;
  }
}
