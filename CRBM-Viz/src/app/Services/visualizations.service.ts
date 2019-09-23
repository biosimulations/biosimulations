import { Injectable } from '@angular/core';
import { Visualization } from 'src/app/Models/visualization';

@Injectable({
  providedIn: 'root',
})
export class VisualizationsService {
  constructor() {}
  getVisualizations(): Visualization[] {
    return [
      {
        name: 'viz1',
        id: 1,
        spec:
          'https://raw.githubusercontent.com/vega/vega/master/docs/examples/bar-chart.vg.json',
      },
      {
        name: 'viz2',
        id: 2,
        spec: 'assets/examples/annual-temperature.vg.json',
      },
      {
        name: 'viz3',
        id: 3,
        spec:
          'https://raw.githubusercontent.com/vega/vega/master/docs/examples/bar-chart.vg.json',
      },
    ];
  }
}
