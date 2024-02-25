import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textCut',
})
export class TextCutPipe implements PipeTransform {
  transform(value: string, start: number, end: number): string {
    if (value.length <= end) {
      return value;
    } else {
      return value.substring(start, end) + '...';
    }
  }
}
