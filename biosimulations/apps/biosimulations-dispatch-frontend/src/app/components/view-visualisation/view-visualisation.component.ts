import { Component, OnInit, ElementRef, ViewChild, Input, ChangeDetectorRef } from '@angular/core';
import * as vega from 'vega';
import vegaEmbed from 'vega-embed';

@Component({
  selector: 'biosimulations-view-visualisation',
  templateUrl: './view-visualisation.component.html',
  styleUrls: ['./view-visualisation.component.scss']
})
export class ViewVisualisationComponent implements OnInit {

  public graph = {
    data: [
        { x: [1, 2, 3], y: [2, 6, 3], type: 'scatter', mode: 'lines+points'},
        { x: [1, 2, 3], y: [12, 16, 13], type: 'scatter', mode: 'lines+points'},
        { x: [1, 2, 3], y: [21, 61, 31], type: 'scatter', mode: 'lines+points'},
        // { x: [1, 2, 3], y: [2, 5, 3], type: 'bar' },
    ],
    layout: {width: 600, height: 400, title: 'A Fancy Plot'}
  };

  constructor() {

  }

  ngOnInit() {

  }
}