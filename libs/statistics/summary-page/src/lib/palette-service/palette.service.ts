import { Injectable } from '@angular/core';
import * as palette2 from 'google-palette';

let palette: (arg: string, count: number) => string[];

@Injectable({
  providedIn: 'root',
})
export class PaletteService {
  getColorPalette(count: number): string[] {
    palette = palette2;
    return palette('tol-rainbow', count).map((hex: string) => `#${hex}`);
  }
  constructor() {}
}
