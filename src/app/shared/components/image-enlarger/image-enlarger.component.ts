import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ImageModalComponent } from '../image-modal/image-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-image-enlarger',
  templateUrl: './image-enlarger.component.html',
  styleUrls: ['./image-enlarger.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageEnlargerComponent {
  @Input({ required: true }) imgSrc: string = '';
  @Input({ required: true }) alt: string = '';
  @Input() largeImgSrc?: string = undefined;

  constructor(private dialog: MatDialog) {}

  openModal(): void {
    this.dialog.open(ImageModalComponent, {
      data: {
        src: this.largeImgSrc ?? this.imgSrc,
        alt: this.alt,
      },
    });
  }
}
