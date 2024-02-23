import { LoadingService } from './../../services/loading.service';
import { FormControl } from '@angular/forms';
import { SharedService } from './../../services/shared.service';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs';
import { UnsubscribeAbstract } from '@app/shared/helpers/unsubscribe.abstract';
import { ActivatedRoute, Router } from '@angular/router';
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
  private query = '';
  searchControl = new FormControl<string>(this.query);
  private readonly mediaType: MediaType = 'tv';

  constructor(
    private sharedService: SharedService,
    private router: Router,
    private loadingService: LoadingService,
    private route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.setQuery();
    this.searchChanges();
  }

  private searchChanges(): void {
    this.searchControl.valueChanges
      .pipe(
        map((query) => query?.trim()),
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.ngUnsubscribe$)
      )
      .subscribe((query) => {
        if (!query) {
          return;
        }

        this.loadingService.setLoading(true);

        this.query = query;
        this.sharedService.setSearchSubject(query);

        if (!this.router.url.includes('search')) {
          this.navigate();
        }
      });
  }

  private setQuery(): void {
    this.query = this.route.snapshot.queryParams['q'];

    if (this.query) {
      this.searchControl.setValue(this.query);
    }
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
