import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'round',
})
export class RoundPipe implements PipeTransform {
  transform(value: number, type: 'round' | 'floor' | 'ceil' = 'round'): number {
    return Math[type](value);
  }
}
