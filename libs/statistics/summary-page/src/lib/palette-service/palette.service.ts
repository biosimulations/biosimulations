import { Injectable } from '@angular/core';
import { srgb, SRGB, multiColorGradient, css, GradientColorStop, TypedColor } from '@thi.ng/color';

@Injectable({
  providedIn: 'root',
})
export class PaletteService {
  private static palette = ['#951ed9', '#2196f3', '#38cc00', '#ff9800', '#f44336'];

  public getColorPalette(count: number): string[] {
    const nStops = Math.min(count, PaletteService.palette.length);
    const stopPalette = PaletteService.palette.slice(0, nStops);
    const stops = stopPalette.map((color: string, iStop: number): GradientColorStop<TypedColor<SRGB>> => {
      return [iStop / (nStops - 1), srgb(color)];
    });

    const gradient = multiColorGradient({
      num: count,
      stops: stops,
    });

    return gradient.map(css);
  }
}
