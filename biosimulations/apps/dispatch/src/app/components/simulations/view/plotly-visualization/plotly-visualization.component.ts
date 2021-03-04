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
  x: number[];
  y: number[];
  mode: ScatterTraceMode;
}

export interface Axis {
  title: string | undefined;
  type: AxisType;
}

export interface Layout {
  xaxis: Axis;
  yaxis: Axis;
  showlegend: boolean;
  width: number | undefined;
  height: number | undefined;
}

export interface DataLayout {
  data: ScatterTrace[];
  layout: Layout;
}

@Component({
  selector: 'biosimulations-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.scss'],
})
export class VisualizationComponent {
  data: ScatterTrace[] | undefined = undefined;
  layout: Layout | undefined = undefined;

  @Input()
  set dataLayout(value: DataLayout) {
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
