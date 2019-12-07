import { Component, OnInit, Inject } from '@angular/core';
import { StatsService } from 'src/app/Shared/Services/stats.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  private stats: object;
  public statGraphs: object[] = [];
  public readonly vegaOptions: object = {
    renderer: 'canvas',
  };

  constructor(@Inject(StatsService) private statsService: StatsService) { }

  ngOnInit() {
    this.stats = this.statsService.get();

    this.statGraphs = [
        this.getBarGraph(
          'Count', null, 'log',
          this.stats['countObjectsByType']),
        this.getBarGraph(
          'Models', null, 'linear',
          this.stats['countModelsByFramework']),
        this.getBarGraph(
          'Models', null, 'linear',
          this.stats['countModelsByFormat']),
    ];
  }

  getBarGraph(xAxisLabel: string, yAxisLabel: string, xScaleType: string, data: object[]): object {
    const xScale: object = null;
    return {
      $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
      width: 'container',
      height: 'container',
      padding: {
        left: 3,
        right: 3,
        top: 0,
        bottom: 0,
      },
      autosize: {
        type: 'fit',
        resize: true,
      },
      background: 'transparent',
      config: {
        view: {
          stroke: 'transparent',
        },
      },
      data: {
        values: data
      },
      encoding: {
        y: {
          field: 'category',
          type: 'ordinal',
          axis: {
            title: yAxisLabel,
            gridOpacity: 0,
            minExtent: 84,
            maxExtent: 84,
          },
        },
        x: {
          field: 'count',
          type: 'quantitative',
          scale: {
            type: xScaleType,
          },
          axis: {
            title: xAxisLabel,
            gridOpacity: 0,
          },
        },
      },
      mark: {type: 'bar', color: '#2196f3'},
    };
  }
}
