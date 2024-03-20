import { Directive, ElementRef } from '@angular/core';
import getRandomColor from '../helpers/random-color';

@Directive({
  selector: '[appRandomBgColor]',
})
export class RandomBgColorDirective {
  constructor(private el: ElementRef<HTMLElement>) {
    this.el.nativeElement.style.backgroundColor = getRandomColor();
  }
}
