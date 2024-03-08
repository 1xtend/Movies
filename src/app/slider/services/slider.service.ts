import { Injectable } from '@angular/core';
import { ISlideStyles } from '../models/slide-styles.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SliderService {
  private slideStylesSubject = new BehaviorSubject<ISlideStyles | undefined>(
    undefined
  );
  slideStyles$ = this.slideStylesSubject.asObservable();

  setSlideStyleSubject(style: ISlideStyles): void {
    this.slideStylesSubject.next(style);
  }

  setDragAttributes(el: HTMLElement): void {
    el.querySelectorAll('img').forEach((img) => {
      img.draggable = false;
      img.loading = 'lazy';
    });
    el.querySelectorAll('a').forEach((img) => {
      img.draggable = false;
    });
  }
}
