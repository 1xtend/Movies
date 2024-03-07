import { Directive, ElementRef, OnInit } from '@angular/core';
import getRandomColor from '../helpers/random-color';

@Directive({
  selector: '[appRandomBgColor]',
})
export class RandomBgColorDirective implements OnInit {
  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.el.nativeElement.style.backgroundColor = getRandomColor();
  }
}
