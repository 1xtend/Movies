import { ShowsService } from './shared/services/shows.service';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  openDrawer: boolean = false;

  constructor(private showsService: ShowsService) {}

  ngOnInit(): void {}

  onToggle() {
    this.openDrawer = !this.openDrawer;
  }
}
