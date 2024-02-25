import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @Output() toggleDrawer = new EventEmitter<void>();
  @Input({ required: true }) isTablet: boolean = false;

  show: boolean = false;

  showSearchInput() {
    this.show = !this.show;
  }
}
