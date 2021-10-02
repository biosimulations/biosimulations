import { CombineArchive, PlotlyDataLayout } from '@biosimulations/datamodel/common';
import { LabeledIdentifier } from '@biosimulations/datamodel/api';
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

export interface VegaVisualization {
  _type: 'VegaVisualization';
  id: string;
  name: string;
  renderer: 'Vega';
  simulationId: string;
  sedDocumentConfigurations: CombineArchive;    
  vegaSpec: Observable<VegaSpec>;
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

export interface SedDatasetResults {
  uri: string;
  id: string;
  location: string;
  outputId: string;
  label: string;
  values: (number | boolean | string)[];
}

export interface SedOutputResults {
  uri: string;
  id: string;
  datasets: SedDatasetResults[];
}

export interface SedDocumentResults {
  uri: string;
  location: string;
  outputs: SedOutputResults[];
}

export type CombineResults = SedDocumentResults[];

export interface SedDatasetResultsMap {
  [uri: string]: SedDatasetResults;
}
