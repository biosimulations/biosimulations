import { Component, OnInit, Input } from '@angular/core';
import vegaEmbed from 'vega-embed'
@Component({
  selector: 'app-vega-viewer',
  templateUrl: './vega-viewer.component.html',
  styleUrls: ['./vega-viewer.component.sass']
})
export class VegaViewerComponent implements OnInit {
  spec = "https://raw.githubusercontent.com/vega/vega/master/docs/examples/bar-chart.vg.json";
  @Input() specid:string;

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
  vegaEmbed("#"+this.specid, this.spec)
  // result.view provides access to the Vega View API
  .then(result => console.log(result))
  .catch(console.warn);
  }

} 
