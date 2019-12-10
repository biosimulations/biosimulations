import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import vegaEmbed from 'vega-embed';

@Component({
  selector: 'app-vega-viewer',
  templateUrl: './vega-viewer.component.html',
  styleUrls: ['./vega-viewer.component.sass'],
})
export class VegaViewerComponent {
  private _spec: object | string;
  private _options: object;
  @ViewChild('vegaContainer', { static: true }) vegaContainer: ElementRef;

  @Input()
  set spec(value: object | string) {
    this._spec = value;

    if (typeof value !== 'string') {
      value['width'] = 'container';
      value['height'] = 'container';
      value['autosize'] = {
        type: 'fit',
        resize: true,
      };
      value['background'] = 'transparent';
    }

    this.load();
  }

  @Input()
  set options(value: object) {
    this._options = value;
    this.load();
  }

  constructor() {}

  load() {
    if (this.vegaContainer && this._spec) {
      // console.log(this._spec);
      vegaEmbed(this.vegaContainer.nativeElement, this._spec, this._options)
        // result.view provides access to the Vega View API
        // .then(result => console.log(result))
        .catch(console.error);
    }
  }
}
