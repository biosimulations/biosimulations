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
    renderer: 'svg',
  };

  constructor(@Inject(StatsService) private statsService: StatsService) { }

  ngOnInit() {
    this.stats = this.statsService.get();
    this.statGraphs = [
        this.getGraph1(),
        this.getGraph1(),
        this.getGraph1(),
    ];
  }

  getGraph1(): object {
    return {
      "$schema": "https://vega.github.io/schema/vega-lite/v4.json",      
      "width": "container",
      "height": "container",
      "padding": 0,
      "autosize": {
        "type": "fit",
        "resize": true,
      },
      "background": "#ffffff00",
      "config": {
        "view": {
          "stroke": "transparent",
        },
      },
      "data": {
        "values": [
          {"Day": 1, "Value": 54.8},
          {"Day": 2, "Value": 112.1},
          {"Day": 3, "Value": 63.6},
          {"Day": 4, "Value": 37.6},
          {"Day": 5, "Value": 79.7},
          {"Day": 6, "Value": 137.9},
          {"Day": 7, "Value": 120.1},
          {"Day": 8, "Value": 103.3},
          {"Day": 9, "Value": 394.8},
          {"Day": 10, "Value": 199.5},
          {"Day": 11, "Value": 72.3},
          {"Day": 12, "Value": 51.1},
          {"Day": 13, "Value": 112.0},
          {"Day": 14, "Value": 174.5},
          {"Day": 15, "Value": 130.5}
        ]
      },
      "mark": "bar",
      "encoding": {
        "x": {
          "field": "Day", 
          "type": "ordinal", 
          "axis": {
            "labelAngle": 0,
            "gridOpacity": 0,
          },
        },
        "y": {
          "field": "Value", 
          "type": "quantitative", 
          "axis": {
            "gridOpacity": 0,
          },
        },
      },
    };
  }
}
