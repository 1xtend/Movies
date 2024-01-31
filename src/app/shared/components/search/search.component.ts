import { FormControl } from '@angular/forms';
import { SharedService } from './../../services/shared.service';
import { Component, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { UnsubscribeAbstract } from '@app/shared/helpers/unsubscribe.abstract';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent extends UnsubscribeAbstract implements OnInit {
  searchControl = new FormControl<string>('');

  constructor(private sharedService: SharedService) {
    super();
  }

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.ngUnsubscribe$)
      )
      .subscribe((query) => {
        if (query) {
          this.sharedService.setSearchSubject(query);
          console.log(query);
        }
      });
  }
}
