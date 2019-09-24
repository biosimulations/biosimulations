import { Injectable } from '@angular/core';
import { Visualization } from '../Models/visualization';

@Injectable({
    providedIn: 'root',
})
export class VisualizeService {
    constructor() {}
    getVisualizations(id: number = 1): Visualization[] {
        let viz = [
            {
                name: 'viz1',
                id: 1,
                spec:
                    'https://raw.githubusercontent.com/vega/vega/master/docs/examples/bar-chart.vg.json',
            },
            {
                name: 'viz2',
                id: 2,
                spec:
                    'https://raw.githubusercontent.com/vega/vega/master/docs/examples/bar-chart.vg.json',
            },
            {
                name: 'viz3',
                id: 3,
                spec:
                    'https://raw.githubusercontent.com/vega/vega/master/docs/examples/bar-chart.vg.json',
            },
            {
                name: 'viz4',
                id: 4,
                spec:
                    'https://raw.githubusercontent.com/vega/vega/master/docs/examples/bar-chart.vg.json',
            },
            {
                name: 'viz5',
                id: 5,
                spec:
                    'https://raw.githubusercontent.com/vega/vega/master/docs/examples/bar-chart.vg.json',
            },
        ];
        return viz;
    }
}
