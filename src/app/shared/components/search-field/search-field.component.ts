import { FormControl } from '@angular/forms';
import { SharedService } from './../../services/shared.service';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
} from '@angular/core';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaType } from '@app/shared/models/media.type';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-search',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFieldComponent implements OnInit {
  private query = '';
  searchControl = new FormControl<string>(this.query);
  private readonly mediaType: MediaType = 'tv';

  constructor(
    private sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute,
    private destroyRef: DestroyRef
  ) {}

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
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((query) => {
        if (!query) {
          return;
        }

        this.query = query;
        this.sharedService.setSearchSubject(query);

        if (!this.router.url.includes('search')) {
          this.navigate();
        }
      });
  }

  private setQuery(): void {
    this.query = this.route.snapshot.queryParams['query'];

    this.searchControl.setValue(this.query ?? '', {
      emitEvent: false,
    });
  }

  private navigate(): void {
    this.router.navigate(['/search', this.mediaType], {
      queryParams: {
        query: this.query,
        page: 1,
      },
    });
  }
}
