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
      description: 'A basic line chart example.',
      width: 500,
      height: 200,
      padding: 5,
    
      signals: [
        {
          name: 'interpolate',
          value: 'linear',
          bind: {
            input: 'select',
            options: [
              'basis',
              'cardinal',
              'catmull-rom',
              'linear',
              'monotone',
              'natural',
              'step',
              'step-after',
              'step-before'
            ]
          }
        }
      ],
    
      data: [
        {
          name: 'table',
          values: [
            {
              x: 0,
              y: 50,
              c: 0
            },
            {
              x: 3.6,
              y: 48.8285,
              c: 0
            },
            {
              x: 7.2,
              y: 47.7821,
              c: 0
            },
            {
              x: 10.8,
              y: 46.8427,
              c: 0
            },
            {
              x: 14.4,
              y: 45.9957,
              c: 0
            },
            {
              x: 18,
              y: 45.2295,
              c: 0
            },
            {
              x: 21.6,
              y: 44.5341,
              c: 0
            },
            {
              x: 25.2,
              y: 43.9015,
              c: 0
            },
            {
              x: 28.8,
              y: 43.3248,
              c: 0
            },
            {
              x: 32.4,
              y: 42.7978,
              c: 0
            },
            {
              x: 36,
              y: 42.3157,
              c: 0
            },
            {
              x: 39.6,
              y: 41.8739,
              c: 0
            },
            {
              x: 43.2,
              y: 41.4685,
              c: 0
            },
            {
              x: 46.8,
              y: 41.096,
              c: 0
            },
            {
              x: 50.4,
              y: 40.7536,
              c: 0
            },
            {
              x: 54,
              y: 40.4384,
              c: 0
            },
            {
              x: 57.6,
              y: 40.148,
              c: 0
            },
            {
              x: 61.2,
              y: 39.8803,
              c: 0
            },
            {
              x: 64.8,
              y: 39.6334,
              c: 0
            },
            {
              x: 68.4,
              y: 39.4055,
              c: 0
            },
            {
              x: 3531.6,
              y: 36.5385,
              c: 1
            },
            {
              x: 3535.2,
              y: 36.5385,
              c: 1
            },
            {
              x: 3538.8,
              y: 36.5385,
              c: 1
            },
            {
              x: 3542.4,
              y: 36.5385,
              c: 1
            },
            {
              x: 3546,
              y: 36.5385,
              c: 1
            },
            {
              x: 3549.6,
              y: 36.5385,
              c: 1
            },
            {
              x: 3553.2,
              y: 36.5385,
              c: 1
            },
            {
              x: 3556.8,
              y: 36.5385,
              c: 1
            },
            {
              x: 3560.4,
              y: 36.5385,
              c: 1
            },
            {
              x: 3564,
              y: 36.5385,
              c: 1
            },
            {
              x: 3567.6,
              y: 36.5385,
              c: 1
            },
            {
              x: 3571.2,
              y: 36.5385,
              c: 1
            },
            {
              x: 3574.8,
              y: 36.5385,
              c: 1
            },
            {
              x: 3578.4,
              y: 36.5385,
              c: 1
            },
            {
              x: 3582,
              y: 36.5385,
              c: 1
            },
            {
              x: 3585.6,
              y: 36.5385,
              c: 1
            },
            {
              x: 3589.2,
              y: 36.5385,
              c: 1
            },
            {
              x: 3592.8,
              y: 36.5385,
              c: 1
            },
            {
              x: 3596.4,
              y: 36.5385,
              c: 1
            },
            {
              x: 3600,
              y: 36.5385,
              c: 1
            }
          ]
        }
      ],
    
      scales: [
        {
          name: 'x',
          type: 'point',
          range: 'width',
          domain: {data: 'table', field: 'x'}
        },
        {
          name: 'y',
          type: 'linear',
          range: 'height',
          nice: true,
          zero: true,
          domain: {data: 'table', field: 'y'}
        },
        {
          name: 'color',
          type: 'ordinal',
          range: 'category',
          domain: {data: 'table', field: 'c'}
        }
      ],
    
      axes: [
        {orient: 'bottom', scale: 'x'},
        {orient: 'left', scale: 'y'}
      ],
    
      marks: [
        {
          type: 'group',
          from: {
            facet: {
              name: 'series',
              data: 'table',
              groupby: 'c'
            }
          },
          marks: [
            {
              type: 'line',
              from: {data: 'series'},
              encode: {
                enter: {
                  x: {scale: 'x', field: 'x'},
                  y: {scale: 'y', field: 'y'},
                  stroke: {scale: 'color', field: 'c'},
                  strokeWidth: {value: 2}
                },
                update: {
                  interpolate: {signal: 'interpolate'},
                  strokeOpacity: {value: 1}
                },
                hover: {
                  strokeOpacity: {value: 0.5}
                }
              }
            }
          ]
        }
      ]
    }
  }

}
