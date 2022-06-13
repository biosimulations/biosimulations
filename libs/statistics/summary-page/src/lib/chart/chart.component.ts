import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

import { Chart, ChartType, ChartOptions, ChartData, LogarithmicScale } from 'chart.js';
import { PaletteService } from '../palette-service/palette.service';

@Component({
  selector: 'biosimulations-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
  @Input()
  public chartType: ChartType = 'bar';

  @Input()
  public chartValues: number[] = [];

  @Input()
  public chartLabels: string[] = [];

  @Input()
  public dataLabel?: string | undefined = undefined;

  @Input()
  public yScale: 'linear' | 'logarithmic' = 'linear';

  @Input()
  public yRotation: number | undefined;

  @ViewChild('canvas')
  public canvas!: ElementRef<any>;

  public options: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 1.5,
    font: { family: 'Raleway' },
  };

  public barData!: ChartData<'bar'>;
  public pieData!: ChartData<'pie'>;
  public lineData!: ChartData<'line'>;
  public colorPalette!: CanvasGradient;

  public constructor(private service: PaletteService) {}

  public ngOnInit(): void {
    Chart.register(LogarithmicScale);
    const colorScheme = this.service.getColorPalette(this.chartValues?.length);
    if (!this.dataLabel) {
      this.options = {
        ...this.options,
        plugins: {
          legend: {
            display: false,
          },
        },
      };
    }
    if (this.chartType === 'bar') {
      this.barData = {
        labels: this.chartLabels,

        datasets: [
          {
            label: this.dataLabel,
            data: this.chartValues,

            backgroundColor: colorScheme,
            borderColor: '#fff',
            hoverBackgroundColor: colorScheme,
            hoverBorderColor: '#fff',
          },
        ],
      };
      this.options = {
        ...this.options,
        scales: {
          y: {
            type: this.yScale,
            min: 0,
            ticks: {
              includeBounds: true,
            },
          },
          x: {
            ticks: {
              autoSkip: false,
              minRotation: this.yRotation,
              maxRotation: this.yRotation,
              includeBounds: true,
              callback: (value, index, ticks): string => {
                console.error({ value, index, ticks });
                const label = this.chartLabels[index];
                const max_length = 16;
                const padding = Math.max(0, max_length - label.length) + 3;
                return label.length > max_length
                  ? label.substring(0, max_length) + '...'
                  : ''.padStart(padding, ' ') + label;
              },
            },
          },
        },
      };
    } else if (this.chartType === 'pie') {
      this.options = {
        ...this.options,

        plugins: {
          legend: {
            display: true,
          },
        },
      };

      this.pieData = {
        labels: this.chartLabels,
        datasets: [
          {
            label: this.dataLabel,
            data: this.chartValues,
            hoverOffset: 4,
            backgroundColor: colorScheme,
            borderColor: '#fff',
            hoverBackgroundColor: colorScheme,
            hoverBorderColor: '#fff',
          },
        ],
      };
    } else if (this.chartType === 'line') {
      this.lineData = {
        labels: this.chartLabels,
        datasets: [
          {
            label: this.dataLabel,
            data: this.chartValues,
            borderColor: '#2196f3',
            backgroundColor: '#2196f3',
            hoverBorderColor: '#2196f3',
            hoverBackgroundColor: '#2196f3',
            pointRadius: 0,
            pointBackgroundColor: '#2196f3',
            pointBorderColor: '#0a72c4',
            pointHoverBackgroundColor: '#ff9800',
            pointHoverBorderColor: '#bf7100',
          },
        ],
      };
    }
  }
}
