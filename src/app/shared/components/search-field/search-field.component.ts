import { FormControl } from '@angular/forms';
import { SharedService } from './../../services/shared.service';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, from, takeUntil } from 'rxjs';
import { UnsubscribeAbstract } from '@app/shared/helpers/unsubscribe.abstract';
import { Params, Router } from '@angular/router';

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

  constructor(private sharedService: SharedService, private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.initSearch();
  }

  private initSearch() {
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
        this.navigate();
      });
  }

  private navigate() {
    const params: Params = {
      q: this.query,
      page: 1,
    };

    this.router.navigate(['search', 'tv'], {
      queryParams: params,
    });
  }
}
