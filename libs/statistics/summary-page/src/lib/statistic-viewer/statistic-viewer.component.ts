import { Component, Input } from '@angular/core';
import { StatsChart, StatsChartType } from '../summary-page.model';

@Component({
  selector: 'biosimulations-statistic-viewer',
  templateUrl: './statistic-viewer.component.html',
  styleUrls: ['./statistic-viewer.component.scss'],
})
export class StatisticViewerComponent {
  @Input()
  public stat!: StatsChart;

  public histogramChartType = StatsChartType.histogram;
  public pieChartType = StatsChartType.pie;
  public lineChartType = StatsChartType.counter;
  public distributionChartType = StatsChartType.distribution;
}
