export enum PlotlyAxisType {
  linear = 'linear',
  log = 'log',
}

export enum PlotlyTraceMode {
  lines = 'lines',
  markers = 'markers',
  linesMarkers = 'lines+markers',
  linesMarkersText = 'lines+markers+text',
  none = 'none',
}

export enum PlotlyTraceType {
  scatter = 'scatter',
  histogram = 'histogram',
  heatmap = 'heatmap',
}

export type PlotlyTraceLineDash = 'solid' | 'dot' | 'dash' | 'longdash' | 'dashdot' | 'longdashdot';

export interface PlotlyTraceLine {
  color?: string;
  dash?: PlotlyTraceLineDash;
  width?: number;
}

export interface PlotlyTraceMarkerLine {
  color?: string;
  width?: number;
}

export type PlotlyTraceMarkerSymbol = 'circle' | 'circle-open' | 'circle-dot' | 'circle-open-dot' | 'square' | 'square-open' | 'square-dot' | 'square-open-dot' | 'diamond' | 'diamond-open' | 'diamond-dot' | 'diamond-open-dot' | 'cross' | 'cross-open' | 'cross-dot' | 'cross-open-dot' | 'x' | 'x-open' | 'x-dot' | 'x-open-dot' | 'triangle-up' | 'triangle-up-open' | 'triangle-up-dot' | 'triangle-up-open-dot' | 'triangle-down' | 'triangle-down-open' | 'triangle-down-dot' | 'triangle-down-open-dot' | 'triangle-left' | 'triangle-left-open' | 'triangle-left-dot' | 'triangle-left-open-dot' | 'triangle-right' | 'triangle-right-open' | 'triangle-right-dot' | 'triangle-right-open-dot' | 'triangle-ne' | 'triangle-ne-open' | 'triangle-ne-dot' | 'triangle-ne-open-dot' | 'triangle-se' | 'triangle-se-open' | 'triangle-se-dot' | 'triangle-se-open-dot' | 'triangle-sw' | 'triangle-sw-open' | 'triangle-sw-dot' | 'triangle-sw-open-dot' | 'triangle-nw' | 'triangle-nw-open' | 'triangle-nw-dot' | 'triangle-nw-open-dot' | 'pentagon' | 'pentagon-open' | 'pentagon-dot' | 'pentagon-open-dot' | 'hexagon' | 'hexagon-open' | 'hexagon-dot' | 'hexagon-open-dot' | 'hexagon2' | 'hexagon2-open' | 'hexagon2-dot' | 'hexagon2-open-dot' | 'octagon' | 'octagon-open' | 'octagon-dot' | 'octagon-open-dot' | 'star' | 'star-open' | 'star-dot' | 'star-open-dot' | 'hexagram' | 'hexagram-open' | 'hexagram-dot' | 'hexagram-open-dot' | 'star-triangle-up' | 'star-triangle-up-open' | 'star-triangle-up-dot' | 'star-triangle-up-open-dot' | 'star-triangle-down' | 'star-triangle-down-open' | 'star-triangle-down-dot' | 'star-triangle-down-open-dot' | 'star-square' | 'star-square-open' | 'star-square-dot' | 'star-square-open-dot' | 'star-diamond' | 'star-diamond-open' | 'star-diamond-dot' | 'star-diamond-open-dot' | 'diamond-tall' | 'diamond-tall-open' | 'diamond-tall-dot' | 'diamond-tall-open-dot' | 'diamond-wide' | 'diamond-wide-open' | 'diamond-wide-dot' | 'diamond-wide-open-dot' | 'hourglass' | 'hourglass-open' | 'bowtie' | 'bowtie-open' | 'circle-cross' | 'circle-cross-open' | 'circle-x' | 'circle-x-open' | 'square-cross' | 'square-cross-open' | 'square-x' | 'square-x-open' | 'diamond-cross' | 'diamond-cross-open' | 'diamond-x' | 'diamond-x-open' | 'cross-thin' | 'cross-thin-open' | 'x-thin' | 'x-thin-open' | 'asterisk' | 'asterisk-open' | 'hash' | 'hash-open' | 'hash-dot' | 'hash-open-dot' | 'y-up' | 'y-up-open' | 'y-down' | 'y-down-open' | 'y-left' | 'y-left-open' | 'y-right' | 'y-right-open' | 'line-ew' | 'line-ew-open' | 'line-ns' | 'line-ns-open' | 'line-ne' | 'line-ne-open' | 'line-nw' | 'line-nw-open' | 'arrow-up' | 'arrow-up-open' | 'arrow-down' | 'arrow-down-open' | 'arrow-left' | 'arrow-left-open' | 'arrow-right' | 'arrow-right-open' | 'arrow-bar-up' | 'arrow-bar-up-open' | 'arrow-bar-down' | 'arrow-bar-down-open' | 'arrow-bar-left' | 'arrow-bar-left-open' | 'arrow-bar-right' | 'arrow-bar-right-open';

export interface PlotlyTraceMarker {
  symbol?: PlotlyTraceMarkerSymbol;
  size?: number;
  color?: string;
  line?: PlotlyTraceMarkerLine;
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
  line?: PlotlyTraceLine;
  marker?: PlotlyTraceMarker;
  fill?: 'none' | 'tozeroy' | 'tozerox' | 'tonexty' | 'tonextx' | 'toself' | 'tonext';
  fillColor?: string;
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
  data?: PlotlyTrace[];
  layout?: PlotlyLayout;
  dataErrors?: string[];
}
