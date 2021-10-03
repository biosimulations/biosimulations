import { LabeledIdentifier } from '@biosimulations/datamodel/api';
import { BiosimulationsIcon } from '@biosimulations/shared/icons';
import { Observable } from 'rxjs';

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
