import getRandomNumber from './random-number';

export default function getRandomColor(): string {
  let colors: number[] = [];

  for (let i = 0; i < 3; i++) {
    colors.push(getRandomNumber(0, 255));
  }

  return `rgb(${colors[0]}, ${colors[1]}, ${colors[2]})`;
}
