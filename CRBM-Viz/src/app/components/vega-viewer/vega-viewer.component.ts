import { Component, OnInit } from '@angular/core';
import vegaEmbed from 'vega-embed'
@Component({
  selector: 'app-vega-viewer',
  templateUrl: './vega-viewer.component.html',
  styleUrls: ['./vega-viewer.component.sass']
})
export class VegaViewerComponent implements OnInit {
  spec= {
    "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
    "description": "A simple bar chart with embedded data.",
    "width": 360,
    "data": {
        "values": [
            {
                "a": "A",
                "b": 28
            },
            {
                "a": "B",
                "b": 55
            },
            {
                "a": "C",
                "b": 43
            },
            {
                "a": "D",
                "b": 91
            },
            {
                "a": "E",
                "b": 81
            },
            {
                "a": "F",
                "b": 53
            },
            {
                "a": "G",
                "b": 19
            },
            {
                "a": "H",
                "b": 87
            },
            {
                "a": "I",
                "b": 52
            }
        ]
    },
    "mark": "bar",
    "encoding": {
        "x": {
            "field": "a",
            "type": "ordinal"
        },
        "y": {
            "field": "b",
            "type": "quantitative"
        },
        "tooltip": {
            "field": "b",
            "type": "quantitative"
        }
    }
}
  constructor() { 

  }

  ngOnInit() {
    console.log("on init")
    this.load()
  }
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async load(){
  await this.sleep(2000)
  vegaEmbed("#vis", this.spec)
  // result.view provides access to the Vega View API
  .then(result => console.log(result))
  .catch(console.warn);
  }

}
