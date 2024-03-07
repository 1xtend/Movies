import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-truncate-text',
  templateUrl: './truncate-text.component.html',
  styleUrls: ['./truncate-text.component.scss'],
})
export class TruncateTextComponent {
  @Input({ required: true }) text: string = '';
  @Input() start: number = 0;
  @Input() end: number = 100;

  isOpened: boolean = false;

  toggleText(): void {
    this.isOpened = !this.isOpened;
  }
}
