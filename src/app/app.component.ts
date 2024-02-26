import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  opened: boolean = false;
  isTablet: boolean = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.breakpointChanges();
  }

  private breakpointChanges(): void {
    this.breakpointObserver
      .observe(['(max-width: 768px)'])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result: BreakpointState) => {
        this.isTablet = result.matches;
      });
  }
}
