import { Component, ElementRef, Input, ViewChild } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ChartType, ChartOptions, ChartData } from 'chart.js';
import { PaletteService } from '../palette-service/palette.service';

@Component({
  selector: 'biosimulations-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent {
  @Input()
  public chartType: ChartType = 'bar';

  @Input()
  public chartValues: number[] = [];

  @Input()
  public chartLabels: string[] = [];

  @Input()
  public dataLabel?: string | undefined = undefined;

  @ViewChild('canvas')
  public canvas!: ElementRef<any>;

  public options: ChartOptions = {
    responsive: true,
    maintainAspectRatio: true,

    font: { family: 'Raleway' },
  };

  public barData!: ChartData<'bar'>;
  public pieData!: ChartData<'pie'>;
  public lineData!: ChartData<'line'>;
  public colorPalette!: CanvasGradient;

  constructor(private service: PaletteService) {}

  public ngOnInit(): void {
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
