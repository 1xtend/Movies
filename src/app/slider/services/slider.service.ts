import { Injectable } from '@angular/core';
import { ISlideStyles } from '../models/slide-styles.interface';
import { BehaviorSubject, Subject } from 'rxjs';
import { SliderModule } from '../slider.module';

@Injectable({
  providedIn: 'root',
})
export class SliderService {
  // slideStyles?: ISlideStyle;

  private slideStylesSubject = new BehaviorSubject<ISlideStyles | undefined>(
    undefined
  );
  slideStyles$ = this.slideStylesSubject.asObservable();

  constructor() {}

  setSlideStyleSubject(style: ISlideStyles): void {
    this.slideStylesSubject.next(style);
  }

  setDragAttributes(element: HTMLElement): void {
    element.querySelectorAll('img').forEach((img) => {
      img.draggable = false;
      img.loading = 'lazy';
    });
    element.querySelectorAll('a').forEach((img) => {
      img.draggable = false;
    });
  }
}
