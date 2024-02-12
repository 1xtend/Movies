import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time',
})
export class TimePipe implements PipeTransform {
  transform(value: number): string {
    const hours = Math.floor(value / 60);
    const minutes = Math.floor(value % 60);

    const hoursText = hours > 0 ? hours + 'h' : '';
    const minutesText = minutes > 0 ? minutes + 'm' : '';

    const result = `${hoursText} ${minutesText}`;

    return result;
  }
}
