import { LoadingService } from './../shared/services/loading.service';
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
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent extends UnsubscribeAbstract implements OnInit {
  shows?: IShowsRequest;

  constructor(
    private sharedService: SharedService,
    private showsService: ShowsService,
    private activatedRoute: ActivatedRoute // private _snackBar: MatSnackBar
  ) {
    super();
  }

  ngOnInit(): void {
    this.sharedService.search$
      .pipe(
        switchMap((query) => {
          const params = this.activatedRoute.snapshot.queryParams;
          const search = query || params['q'];

          return search ? this.showsService.searchShows(search) : EMPTY;
        }),
        takeUntil(this.ngUnsubscribe$)
      )
      .subscribe((res) => {
        console.log('HTTP Respones: ', res);

        this.shows = res;

        // if (res.total_results === 0) {
        //   this.openSnackBar('No results', 'Clear');
        // }
      });
  }

  // openSnackBar(message: string, action: string): void {
  //   this._snackBar.open(message, action, {
  //     duration: 2000,
  //   });
  // }
}
