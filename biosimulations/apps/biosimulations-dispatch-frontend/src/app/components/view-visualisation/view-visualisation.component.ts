import { Component, OnInit, ElementRef, ViewChild, Input, ChangeDetectorRef } from '@angular/core';
import * as vega from 'vega';
import vegaEmbed from 'vega-embed';

@Component({
  selector: 'biosimulations-view-visualisation',
  templateUrl: './view-visualisation.component.html',
  styleUrls: ['./view-visualisation.component.scss']
})
export class ViewVisualisationComponent implements OnInit {
  /*
  TODO: make size responsive to screen size
  See https://github.com/vega/vega/issues/755

  (JRK) I already tried adding a handler for window.resize to set the width and height. Wasn't successful.

  Note, Vega can only automatically fit visualizations with that do not use facets, layers, or concatenation.
  */

  private _spec: any = {};
  private _options: object = {};
  @ViewChild('vegaContainer', { static: true })
  vegaContainer!: ElementRef;
  viewApi:any = {};
  private _data: object = {};

  @Input()
  set spec(value: any) {
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

  constructor() { }

  ngOnInit(): void {
    this.spec = {
      $schema: 'https://vega.github.io/schema/vega/v5.json',
      width: 400,
      height: 200,
      padding: 5,

      data: [
        {
          name: 'table',
          values: [
            {category: 'A', amount: 28},
            {category: 'B', amount: 55},
            {category: 'C', amount: 43}
          ]
        }
      ],

      scales: [
        {
          name: 'xscale',
          type: 'band',
          domain: {data: 'table', field: 'category'},
          range: 'width',
          padding: 0.05,
          round: true
        },
        {
          name: 'yscale',
          domain: {data: 'table', field: 'amount'},
          nice: true,
          range: 'height'
        }
      ],

      axes: [
        { orient: 'bottom', scale: 'xscale' },
        { orient: 'left', scale: 'yscale' }
      ],

      marks: [
        {
          type: 'rect',
          from: {data:'table'},
          encode: {
            enter: {
              x: {scale: 'xscale', field: 'category'},
              width: {scale: 'xscale', band: 1},
              y: {scale: 'yscale', field: 'amount'},
              y2: {scale: 'yscale', value: 0}
            },
            update: {
              fill: {value: 'steelblue'}
            },
            hover: {
              fill: {value: 'red'}
            }
          }
        },
      ]
    }
  }

}
