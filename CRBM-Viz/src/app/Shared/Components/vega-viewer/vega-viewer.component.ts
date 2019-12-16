import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import * as vega from 'vega';
import vegaEmbed from 'vega-embed';

@Component({
  selector: 'app-vega-viewer',
  templateUrl: './vega-viewer.component.html',
  styleUrls: ['./vega-viewer.component.sass'],
})
export class VegaViewerComponent {
  /* 
  TODO: make size response
  See https://github.com/vega/vega/issues/755
  */

  private _spec: object;
  private _options: object;
  @ViewChild('vegaContainer', { static: true }) vegaContainer: ElementRef;
  viewApi;

  @Input()
  set spec(value: object) {
    this._spec = {};
    Object.assign(this._spec, value);

    if (('facet' in this._spec) || ('layer' in this._spec) || ('hconcat' in this._spec) || ('vconcat' in this._spec)) {
      for (const prop of ['autosize', 'height', 'width']) {
        if (prop in this._spec) {
          delete this._spec[prop];
        }
      }

    } else {
      value['width'] = 'container';
      value['height'] = 'container';
      value['autosize'] = {
        type: 'fit',
        resize: true,
      };
    }

    value['background'] = 'transparent';

    this.loadSpec();
  }

  private _data: object = null;

  @Input()
  set data(value: object) {
    this._data = value;
    this.loadData();
  }

  @Input()
  set options(value: object) {
    this._options = value;
    this.loadSpec();
  }

  constructor() {}

  loadSpec() {
    if (this.vegaContainer && this._spec) {
      vegaEmbed(this.vegaContainer.nativeElement, this._spec, this._options)
        // result.view provides access to the Vega View API
        .then(viewApi => {
          this.viewApi = viewApi;          
          this.loadData();
        })
        .catch(console.error);
    }
  }

  loadData() {
    if (this.viewApi && this._data) {
      for(const [key, val] of Object.entries(this._data)) {
        this.viewApi.view.data(key, val);
      };
      this.viewApi.view.runAsync();
    }
  }
}
