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
