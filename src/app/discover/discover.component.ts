import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UnsubscribeAbstract } from '@app/shared/helpers/unsubscribe.abstract';
import { IDiscoverFilters } from '@app/shared/models/filters.interface';
import { MediaType } from '@app/shared/models/media.type';
import { MediaService } from '@app/shared/services/media.service';
import { EMPTY, Subject, combineLatest, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss'],
})
export class DiscoverComponent extends UnsubscribeAbstract implements OnInit {
  // private resSubject = new Subject<
  //   Partial<{
  //     movies: ISearchMoviesResponse;
  //     tvs: ISearchTVsResponse;
  //     people: ISearchPeopleResponse;
  //   }>
  // >();
  // res$ = this.resSubject.asObservable();
  mediaType: MediaType = 'tv';

  private filters: Partial<IDiscoverFilters> = {};

  constructor(
    private route: ActivatedRoute,
    private mediaService: MediaService
  ) {
    super();
  }

  ngOnInit(): void {
    this.paramsChanges();
  }

  private paramsChanges(): void {
    combineLatest({
      data: this.route.data,
      queryParams: this.route.queryParamMap,
    })
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        switchMap(({ data, queryParams }) => {
          this.mediaType = data['type'];
          this.filters = {};

          return this.fetchMedia();
        })
      )
      .subscribe((res) => {
        console.log(res);
      });
  }

  private fetchMedia() {
    if (this.mediaType === 'tv') {
      return this.mediaService.discoverTVs(this.filters);
    }

    if (this.mediaType === 'movie') {
      return this.mediaService.discoverMovies(this.filters);
    }

    return EMPTY;
  }
}
