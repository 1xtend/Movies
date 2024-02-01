import { ShowsService } from './../shared/services/shows.service';
import { EMPTY, Subject, map, switchMap, take, takeUntil, tap } from 'rxjs';
import { SharedService } from './../shared/services/shared.service';
import { Component, OnInit } from '@angular/core';
import { UnsubscribeAbstract } from '@app/shared/helpers/unsubscribe.abstract';
import { IShowsRequest } from '@app/shared/models/shows-request.interface';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Params,
  Router,
} from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent extends UnsubscribeAbstract implements OnInit {
  private showsSubject = new Subject<IShowsRequest>();
  shows$ = this.showsSubject.asObservable();

  constructor(
    private sharedService: SharedService,
    private showsService: ShowsService,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.sharedService.search$
      .pipe(
        switchMap((query) => {
          const params = this.activatedRoute.snapshot.queryParams;

          return this.showsService.searchShows(query || params['q']);
        }),
        takeUntil(this.ngUnsubscribe$)
      )
      .subscribe((res) => {
        this.showsSubject.next(res);
      });
  }
}
