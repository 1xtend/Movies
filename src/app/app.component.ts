import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  openDrawer: boolean = false;

  onToggle() {
    this.openDrawer = !this.openDrawer;
  }
}
