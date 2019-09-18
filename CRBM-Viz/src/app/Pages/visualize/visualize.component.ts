import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-visualize',
  templateUrl: './visualize.component.html',
  styleUrls: ['./visualize.component.sass']
})
export class VisualizeComponent implements OnInit {
specifications= [
  "https://raw.githubusercontent.com/vega/vega/master/docs/examples/bar-chart.vg.json",
  "https://raw.githubusercontent.com/vega/vega/master/docs/examples/bar-chart.vg.json",
  "https://raw.githubusercontent.com/vega/vega/master/docs/examples/bar-chart.vg.json",
  "https://raw.githubusercontent.com/vega/vega/master/docs/examples/bar-chart.vg.json",
]
  constructor() { }

  ngOnInit() {
  }

}
