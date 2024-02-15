import { NotificationService } from './shared/services/notification.service';
import { Component, OnInit } from '@angular/core';
import { MediaService } from './shared/services/media.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  openDrawer: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  onToggle() {
    this.openDrawer = !this.openDrawer;
  }
}
