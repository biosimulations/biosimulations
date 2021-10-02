import { CombineArchive } from '@biosimulations/datamodel/common';
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

export interface SedPlot2DVisualization {
  _type: 'SedPlot2DVisualization';
  id: string;
  name: string;
  location: string;
  outputId: string;
}

export interface VegaVisualization {
  _type: 'VegaVisualization';
  id: string;
  name: string;
  simulationId: string;
  sedDocumentConfigurations: CombineArchive;  
  vegaSpec: Observable<VegaSpec>;
}

export interface Histogram1DVisualization {
  _type: 'Histogram1DVisualization';
  id: string;
  name: string;
}

export interface Heatmap2DVisualization {
  _type: 'Heatmap2DVisualization';
  id: string;
  name: string;
}

export interface Line2DVisualization {
  _type: 'Line2DVisualization';
  id: string;
  name: string;
}

export type Visualization = (
  SedPlot2DVisualization 
  | VegaVisualization 
  | Histogram1DVisualization 
  | Heatmap2DVisualization 
  | Line2DVisualization
);

export interface VisualizationList {
  title: string;
  visualizations: Visualization[];
}