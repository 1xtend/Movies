import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
} from '@angular/core';
import { ISlideStyles } from '../models/slide-styles.interface';
import { SliderService } from '../services/slider.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideComponent implements AfterViewInit {
  private element = this.el.nativeElement;

  constructor(
    private el: ElementRef<HTMLElement>,
    private sliderService: SliderService,
    private destroyRef: DestroyRef
  ) {}

  ngAfterViewInit(): void {
    this.sliderService.setDragAttributes(this.element);

    this.stylesChanges();
  }

  private stylesChanges(): void {
    this.sliderService.slideStyles$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((style) => {
        if (!style) return;

        this.setStyle(style);
      });
  }

  private setStyle(style: ISlideStyles): void {
    this.element.style.width = `${style.width}px`;
    this.element.style.marginRight = `${style.marginRight}px`;
    this.element.style.transitionDuration = `${style.speed}ms`;
  }
}
