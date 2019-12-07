import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import vegaEmbed from 'vega-embed';

@Component({
  selector: 'app-vega-viewer',
  templateUrl: './vega-viewer.component.html',
  styleUrls: ['./vega-viewer.component.sass'],
})
export class VegaViewerComponent {
  private privateSpec: object | string;
  private privateOptions: object;
  @ViewChild('vegaContainer', { static: true }) vegaContainer: ElementRef;

  @Input()
  set spec(value: object | string) {
    this.privateSpec = value;
    this.load();
  }

  @Input()
  set options(value: object) {
    this.privateOptions = value;
    this.load();
  }

  constructor() {}

  load() {
    if (this.vegaContainer && this.privateSpec) {
      // console.log(this.privateSpec);
      vegaEmbed(this.vegaContainer.nativeElement, this.privateSpec, this.privateOptions)
        // result.view provides access to the Vega View API
        // .then(result => console.log(result))
        .catch(console.error);
    }
  }
}
