import { LabeledIdentifier } from '@biosimulations/datamodel/api';
import { CombineArchive, SedDataSet, PlotlyDataLayout } from '@biosimulations/datamodel/common';
import { BiosimulationsIcon } from '@biosimulations/shared/icons';
import { Observable } from 'rxjs';
import { Spec as VegaSpec } from 'vega';

export interface Creator {
  label: string | null;
  uri: string | null;
  icon: BiosimulationsIcon;
}

export interface Attribute {
  icon: BiosimulationsIcon;
  title: string;
  values?: LabeledIdentifier[];
}

export interface ProjectMetadata {
  thumbnails: string[];
  title: string;
  abstract?: string;
  creators: Creator[];
  description?: string;
  attributes: Attribute[];
}

export interface ListItem {
  title: string;  
  value: Observable<string>;
  icon: BiosimulationsIcon;
  url: string | null;
}

export interface List {
  title: string;  
  items: ListItem[];
}

export type SimulationRunMetadata = List[];

export type UriSedDataSetMap = {[uri: string]: SedDataSet};

export interface VegaVisualization {
  _type: 'VegaVisualization';
  id: string;
  name: string;
  userDesigned: false;
  renderer: 'Vega';
  vegaSpec: Observable<VegaSpec | false>;
}

export interface SedPlot2DVisualization {
  _type: 'SedPlot2DVisualization';
  id: string;
  name: string;
  userDesigned: false;
  renderer: 'Plotly';
  plotlyDataLayout: Observable<PlotlyDataLayout>;
}

export interface Histogram1DVisualization {
  _type: 'Histogram1DVisualization';
  id: string;
  name: string; 
  userDesigned: true; 
  simulationRunId: string;
  combineArchiveSedDocs: CombineArchive;
  renderer: 'Plotly';
  uriSedDataSetMap: UriSedDataSetMap;
  plotlyDataLayout?: Observable<PlotlyDataLayout | false>;
}

export interface Heatmap2DVisualization {
  _type: 'Heatmap2DVisualization';
  id: string;
  name: string;
  userDesigned: true;
  simulationRunId: string;
  combineArchiveSedDocs: CombineArchive;
  renderer: 'Plotly';
  uriSedDataSetMap: UriSedDataSetMap;
  plotlyDataLayout?: Observable<PlotlyDataLayout | false>;
}

export interface Line2DVisualization {
  _type: 'Line2DVisualization';
  id: string;
  name: string;
  userDesigned: true;
  simulationRunId: string;
  combineArchiveSedDocs: CombineArchive;
  renderer: 'Plotly';  
  uriSedDataSetMap: UriSedDataSetMap;
  plotlyDataLayout?: Observable<PlotlyDataLayout | false>;
}

export type DesignVisualization = (  
  Histogram1DVisualization 
  | Heatmap2DVisualization 
  | Line2DVisualization
);

export type Visualization = (  
  VegaVisualization 
  | SedPlot2DVisualization
  | DesignVisualization
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
