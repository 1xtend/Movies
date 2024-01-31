import { ShowsService } from './../shared/services/shows.service';
import { Observable, map, switchMap, takeUntil, tap } from 'rxjs';
import { SharedService } from './../shared/services/shared.service';
import { Component, OnInit } from '@angular/core';
import { UnsubscribeAbstract } from '@app/shared/helpers/unsubscribe.abstract';
import { IShowsRequest } from '@app/shared/models/shows-request.interface';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent extends UnsubscribeAbstract implements OnInit {
  shows$?: Observable<IShowsRequest>;

  constructor(
    private sharedService: SharedService,
    private showsService: ShowsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.shows$ = this.sharedService.search$.pipe(
      switchMap((query) => {
        return this.showsService.searchShows(query);
      })
    );
  }
}
