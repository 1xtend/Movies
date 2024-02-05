import { LoadingService } from './../../services/loading.service';
import { FormControl } from '@angular/forms';
import { SharedService } from './../../services/shared.service';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  debounceTime,
  distinctUntilChanged,
  from,
  switchMap,
  take,
  takeUntil,
} from 'rxjs';
import { UnsubscribeAbstract } from '@app/shared/helpers/unsubscribe.abstract';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MediaType } from '@app/shared/models/media.type';

@Component({
  selector: 'app-search',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFieldComponent
  extends UnsubscribeAbstract
  implements OnInit
{
  searchControl = new FormControl<string>('');
  private query = '';
  private readonly mediaType: MediaType = 'tv';

  constructor(
    private sharedService: SharedService,
    private router: Router,
    private loadingService: LoadingService
  ) {
    super();
  }

  ngOnInit(): void {
    this.searchChanges();
  }

  private searchChanges(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.ngUnsubscribe$)
      )
      .subscribe((query) => {
        if (!query) {
          return;
        }

        this.query = query;
        this.sharedService.setSearchSubject(query);

        this.loadingService.setLoading(true);

        if (!this.router.url.includes('search')) {
          this.navigate();
        }
      });
  }

  private navigate(): void {
    this.router.navigate(['/search', this.mediaType], {
      queryParams: {
        q: this.query,
        page: 1,
      },
    });
  }
}
