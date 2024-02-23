import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ISlideStyle } from '../models/slide-style.interface';
import { takeUntil } from 'rxjs';
import { UnsubscribeAbstract } from '@app/shared/helpers/unsubscribe.abstract';

@Component({
  selector: 'app-slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideComponent
  extends UnsubscribeAbstract
  implements AfterViewInit
{
  constructor(private el: ElementRef<HTMLElement>) {
    super();
  }

  ngAfterViewInit(): void {
    this.setAttributes();
  }

  private setAttributes(): void {
    this.el.nativeElement.querySelectorAll('img').forEach((img) => {
      img.draggable = false;
      img.loading = 'lazy';
    });
    this.el.nativeElement.querySelectorAll('a').forEach((img) => {
      img.draggable = false;
    });
  }

  setStyle(style: ISlideStyle): void {
    const element = this.el.nativeElement;

    element.style.width = `${style.width}px`;
    element.style.marginRight = `${style.marginRight}px`;
    element.style.transitionDuration = `${style.speed}ms`;
  }
}
