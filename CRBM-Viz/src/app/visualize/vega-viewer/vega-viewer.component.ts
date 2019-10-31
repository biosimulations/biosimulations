import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import vegaEmbed from 'vega-embed';
import { Visualization } from 'src/app/Shared/Models/visualization';
@Component({
  selector: 'app-vega-viewer',
  templateUrl: './vega-viewer.component.html',
  styleUrls: ['./vega-viewer.component.sass'],
})
export class VegaViewerComponent implements OnInit, AfterViewInit {
  @Input() viz: Visualization;
  spec: object | string;
  specid: string;
  vizname: string;
  root: string;

  constructor() {}

  ngOnInit() {
    this.spec = this.viz.spec;
    this.specid = 'test' + this.viz.id.toString();
    this.vizname = this.viz.name;
    this.root = '#' + this.specid;
  }
  /* This must be done after the view initilizes since the div with the appropriate id has not been created untill view initilization. 
  There will be an error about a non existant element if callled during init */
  ngAfterViewInit() {
    this.load();
  }
  load() {
    console.log(this.viz);
    vegaEmbed(this.root, this.spec)
      // result.view provides access to the Vega View API
      .then(result => console.log(result))
      .catch(console.error);
  }
}
