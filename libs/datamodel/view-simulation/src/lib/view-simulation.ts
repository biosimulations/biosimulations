import { PlotlyDataLayout } from '@biosimulations/datamodel/common';
import { BiosimulationsIcon } from '@biosimulations/shared/icons';
import { Observable } from 'rxjs';
import { Spec as VegaSpec } from 'vega';

export interface VegaVisualization {
  _type: 'VegaVisualization';
  id: string;
  name: string;
  renderer: 'Vega';
  vegaSpec: Observable<VegaSpec | false>;
}

export interface SedPlot2DVisualization {
  _type: 'SedPlot2DVisualization';
  id: string;
  name: string;
  renderer: 'Plotly';
  dataLayout: Observable<PlotlyDataLayout>;
}

export interface Histogram1DVisualization {
  _type: 'Histogram1DVisualization';
  id: string;
  name: string;  
  renderer: 'Plotly';
  dataLayout: Observable<PlotlyDataLayout>;
}

export interface Heatmap2DVisualization {
  _type: 'Heatmap2DVisualization';
  id: string;
  name: string;
  renderer: 'Plotly';
  dataLayout: Observable<PlotlyDataLayout>;
}

export interface Line2DVisualization {
  _type: 'Line2DVisualization';
  id: string;
  name: string;
  renderer: 'Plotly';
  dataLayout: Observable<PlotlyDataLayout>;
}

export type Visualization = (  
  VegaVisualization 
  | SedPlot2DVisualization
  | Histogram1DVisualization 
  | Heatmap2DVisualization 
  | Line2DVisualization
);

export interface VisualizationList {
  title: string;
  visualizations: Visualization[];
}

export interface Directory {
  _type: 'Directory';
  location: string;
  level: number;
  title: string;
}

export interface File {
  _type: 'File';
  location: string;
  level: number;
  title: string;
  basename: string;
  format: string;
  formatUrl: string | null;
  icon: BiosimulationsIcon;
  master: boolean;
  url: string;
  size: string | null;
}

export type Path = Directory | File;
