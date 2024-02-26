import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { filter, skip, take, takeUntil } from 'rxjs';
import { UnsubscribeAbstract } from './shared/helpers/unsubscribe.abstract';
import { NavigationEnd, Route, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent extends UnsubscribeAbstract implements OnInit {
  opened: boolean = false;
  isTablet: boolean = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.breakpointChanges();
  }

  private breakpointChanges(): void {
    this.breakpointObserver
      .observe(['(max-width: 768px)'])
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((result: BreakpointState) => {
        this.isTablet = result.matches;
      });
  }
}
