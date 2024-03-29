import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appLazyImg]',
})
export class LazyImgDirective {
  private static supports = 'loading' in HTMLImageElement.prototype;

  constructor({ nativeElement }: ElementRef<HTMLImageElement>) {
    if (LazyImgDirective.supports) {
      nativeElement.setAttribute('loading', 'lazy');
    }
  }
}
