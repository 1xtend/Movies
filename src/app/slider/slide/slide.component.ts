import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { ISlideStyle } from '../models/slide-style.interface';

@Component({
  selector: 'app-slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.scss'],
})
export class SlideComponent implements AfterViewInit {
  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    this.el.nativeElement.querySelectorAll('img').forEach((img) => {
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
