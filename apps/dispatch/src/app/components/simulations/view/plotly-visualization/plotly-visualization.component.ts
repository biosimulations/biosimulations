import { Component, Input, HostListener, ElementRef } from '@angular/core';

export enum AxisType {
  linear = 'linear',
  log = 'log',
}

export enum ScatterTraceMode {
  lines = 'lines',
  markers = 'markers',
}

export interface ScatterTrace {
  name: string;
  x: (number | boolean | string)[];
  y: (number | boolean | string)[];
  xaxis: string;
  yaxis: string;
  mode: ScatterTraceMode;
}

export interface Axis {
  anchor: string;
  title: string | undefined;
  type: AxisType;
}

export interface Grid {
  rows: number;
  columns: number;
  pattern: 'independent';
}

export interface Layout {
  grid: Grid;
  showlegend: boolean;
  width: number | undefined;
  height: number | undefined;
  [axisId: string]: any; // compiler complains about using type Axis here
}

export interface DataLayout {
  data: ScatterTrace[];
  layout: Layout;
}

@Component({
  selector: 'biosimulations-plotly-visualization',
  templateUrl: './plotly-visualization.component.html',
  styleUrls: ['./plotly-visualization.component.scss'],
})
export class PlotlyVisualizationComponent {
  data: ScatterTrace[] | undefined = undefined;
  layout: Layout | undefined = undefined;
  config: any = {
    scrollZoom: true,
    editable: false,
    toImageButtonOptions: {
      format: 'svg', // one of png, svg, jpeg, webp
      filename: 'chart',
      height: 500,
      width: 700,
      scale: 1, // Multiply title/legend/axis/canvas sizes by this factor
    },
    modeBarButtonsToRemove: [],
    showEditInChartStudio: true,
    plotlyServerURL: 'https://chart-studio.plotly.com',
    // responsive: true,
  };

  @Input()
  set dataLayout(value: DataLayout | null) {
    this.data = value?.data;
    this.layout = value?.layout;
    this.setLayout();
  }

  visible = false;

  constructor(private hostElement: ElementRef) {}

  @HostListener('window:resize')
  onResize() {
    this.setLayout();
  }

  setLayout(): void {
    this.visible = this.hostElement.nativeElement.offsetParent != null;
    if (this.visible && this.layout) {
      const rect = this.hostElement.nativeElement.parentElement.getBoundingClientRect();
      this.layout.width = rect.width;
      this.layout.height = rect.height;
    }
  }
}
