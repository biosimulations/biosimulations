import { Component, OnInit } from "@angular/core";
import { visualization } from "./visualization";
@Component({
  selector: "app-visualize",
  templateUrl: "./visualize.component.html",
  styleUrls: ["./visualize.component.sass"]
})
export class VisualizeComponent implements OnInit {
  visualizations: visualization[] = [
    {
      name: "viz1",
      id: 1,
      spec:
        "https://raw.githubusercontent.com/vega/vega/master/docs/examples/bar-chart.vg.json"
    },
    {
      name: "viz2",
      id: 2,
      spec: "assets/examples/annual-temperature.vg.json"
    }
  ];
  constructor() {}

  ngOnInit() {}
}
