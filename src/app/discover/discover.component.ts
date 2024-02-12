import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { UnsubscribeAbstract } from '@app/shared/helpers/unsubscribe.abstract';
import { IDiscoverFilters } from '@app/shared/models/filters.interface';
import { IGenre } from '@app/shared/models/genre.interface';
import { MediaType } from '@app/shared/models/media.type';
import { IMovie } from '@app/shared/models/movie/movie.interface';
import { ISearchMoviesResponse } from '@app/shared/models/movie/movies-response.interface';
import { IDiscoverParams } from '@app/shared/models/params.interface';
import { ISearchPeopleResponse } from '@app/shared/models/person/people-response.interface';
import { IPerson } from '@app/shared/models/person/person.interface';
import { SortByType } from '@app/shared/models/sort-by.type';
import { ITV } from '@app/shared/models/tv/tv.interface';
import { ISearchTVsResponse } from '@app/shared/models/tv/tvs-response.interface';
import { MediaService } from '@app/shared/services/media.service';
import { SharedService } from '@app/shared/services/shared.service';
import {
  EMPTY,
  Observable,
  Subject,
  combineLatest,
  debounceTime,
  of,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss'],
})
export class DiscoverComponent extends UnsubscribeAbstract implements OnInit {
  private resSubject = new Subject<
    Partial<{
      movies: ISearchMoviesResponse;
      tvs: ISearchTVsResponse;
    }>
  >();
  res$ = this.resSubject.asObservable();
  mediaType: Exclude<MediaType, 'person'> = 'tv';

  filters: IDiscoverFilters = {
    page: 1,
    sort_by: 'popularity.desc',
  };

  noResult: boolean = false;

  genresList: { tv: IGenre[]; movie: IGenre[] } = {
    tv: [],
    movie: [],
  };

  genreControl = new FormControl<number[]>([], {
    nonNullable: true,
  });

  readonly pageSize = 20;

  constructor(
    private route: ActivatedRoute,
    private mediaService: MediaService,
    private router: Router,
    private sharedService: SharedService
  ) {
    super();
  }

  ngOnInit(): void {
    this.paramsChanges();

    this.fetchGenres();
    this.genreChanges();

    console.log(this.genresList);
  }

  private paramsChanges(): void {
    combineLatest({
      data: this.route.data,
      queryParams: this.route.queryParamMap,
    })
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        switchMap(({ data, queryParams }) => {
          this.filters = {
            page: Number(queryParams.get('page')) || 1,
            sort_by:
              (queryParams.get('sort_by') as SortByType) || 'popularity.desc',
            with_genres: queryParams.get('with_genres') || undefined,
            year: Number(queryParams.get('year')) || undefined,
          };

          this.mediaType = data['type'];

          return this.fetchMedia();
        })
      )
      .subscribe((res) => {
        if (!res || !res.total_results) {
          this.noResult = true;
        } else {
          this.noResult = false;
        }

        console.log(res);

        this.sharedService.scrollToTop();
      });
  }

  private genreChanges(): void {
    this.genreControl.valueChanges
      .pipe(debounceTime(1000), takeUntil(this.ngUnsubscribe$))
      .subscribe((genres) => {
        this.filters.with_genres = genres.length ? genres.join(',') : undefined;

        this.setQueryParams(this.filters, this.mediaType);
      });
  }

  private fetchGenres(): void {
    const genresState = this.sharedService.genres;

    if (genresState[this.mediaType].length) {
      this.genresList[this.mediaType] = genresState[this.mediaType];
    } else {
      this.mediaService.getGenres(this.mediaType).subscribe((res) => {
        this.genresList[this.mediaType] = res.genres;
        this.sharedService.genres[this.mediaType] = res.genres;
      });
    }
  }

  private fetchMedia(): Observable<ISearchTVsResponse | ISearchMoviesResponse> {
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
    const filters: IDiscoverFilters = {
      ...this.filters,
      page: e.pageIndex + 1,
    };

    this.setQueryParams(filters, this.mediaType);
  }

  private setQueryParams(
    filters: IDiscoverFilters,
    mediaType: MediaType
  ): void {
    const params: IDiscoverParams = {
      ...filters,
    };

    this.sharedService.setParams(params, '/discover', mediaType);
  }

  mediaTrackBy(index: number, media: ITV | IMovie | IPerson) {
    return media.id;
  }
}
