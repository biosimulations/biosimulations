import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'scientificNotation'})
export class ScientificNotationPipe implements PipeTransform {
  constructor() { }

  transform(value: number): string {
    const absValue: number = Math.abs(value);
    if (absValue !== 0 && (absValue > 1e3 || absValue < 1e-3)) {
        const sign: number = Math.sign(value);
        const logs: number = Math.floor(Math.log10(absValue));
        const num: string = (sign * absValue / Math.pow(10, logs)).toFixed(3);
        return `${num} × 10<sup>${ logs }</sup>`;
    } else {
        return value.toFixed(3);
    }
  }
}
