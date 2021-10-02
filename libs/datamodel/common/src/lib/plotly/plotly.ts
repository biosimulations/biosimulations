export enum PlotlyAxisType {
  linear = 'linear',
  log = 'log',
}

export enum PlotlyTraceMode {
  lines = 'lines',
  markers = 'markers',
}

export enum PlotlyTraceType {
  scatter = 'scatter',
  histogram = 'histogram',
  heatmap = 'heatmap',
}

export interface PlotlyTrace {
  name?: string;
  x?: any[];
  y?: any[];
  z?: any[];
  xaxis?: string;
  yaxis?: string;
  type: PlotlyTraceType;
  mode?: PlotlyTraceMode;
  hoverongaps?: boolean;
}

export interface PlotlyAxis {
  anchor: string;
  title: string | undefined;
  type: PlotlyAxisType;
}

export interface PlotlyGrid {
  rows: number;
  columns: number;
  pattern: 'independent';
}

export interface PlotlyLayout {
  grid: PlotlyGrid;
  showlegend: boolean;
  width: number | undefined;
  height: number | undefined;
  [axisId: string]: any; // compiler complains about using type Axis here
}

export interface PlotlyDataLayout {
  data: PlotlyTrace[];
  layout: PlotlyLayout;
}
