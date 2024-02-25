import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { skip, take, takeUntil } from 'rxjs';
import { UnsubscribeAbstract } from './shared/helpers/unsubscribe.abstract';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent extends UnsubscribeAbstract implements OnInit {
  openDrawer: boolean = false;
  isTablet: boolean = false;

  constructor(private breakpointObserver: BreakpointObserver) {
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

  toggleDrawer() {
    this.openDrawer = !this.openDrawer;
  }

  closeDrawer(): void {
    this.openDrawer = false;
  }
}
