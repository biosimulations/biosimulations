import { Observable } from 'rxjs';

export interface ViewAlgorithm {
  id: string;
  heading: string;
  name: string;
  description: DescriptionFragment[];
  url: string;
  frameworks: ViewFramework[];
  modelFormats: ViewFormat[];
  simulationFormats: ViewFormat[];
  archiveFormats: ViewFormat[];
  parameters: ViewParameter[] | null;
  citations: ViewCitation[];
}

export interface ViewAlgorithmObservable {
  id: string;
  heading: Observable<string>;
  name: Observable<string>;
  description: Observable<DescriptionFragment[]>;
  url: Observable<string>;
  frameworks: Observable<ViewFramework>[];
  modelFormats: Observable<ViewFormat>[];
  simulationFormats: Observable<ViewFormat>[];
  archiveFormats: Observable<ViewFormat>[];
  parameters: ViewParameterObservable[] | null;
  citations: ViewCitation[];
}

export enum DescriptionFragmentType {
  text = 'text',
  href = 'href',
}

export interface DescriptionFragment {
  type: DescriptionFragmentType;
  value: string;
}

export interface ViewFramework {
  id: string;
  name: string;
  url: string;
}

export interface ViewFormat {
  id: string;
  name: string;
  url: string;
}

export interface ViewParameter {
  id: string;
  name: string;
  type: string;
  value: boolean | number | string;
  range: string[] | null;
  kisaoId: string;
  kisaoUrl: string;
}

export interface ViewParameterObservable {
  id: string;
  name: Observable<string>;
  type: string;
  value: boolean | number | string | Observable<string>;
  range: (string | Observable<string>)[] | null;
  kisaoId: string;
  kisaoUrl: string;
}

export interface ViewIdentifier {
  text: string;
  url: string | null;
}

export interface ViewCitation {
  url: string | null;
  text: string;
}

export interface ViewVersion {
  label: string;
  created: string;
  image?: string;
  url?: string;
  validated: boolean;
}

export interface ViewSimulator {
  _json: string;
  id: string;
  version: string;
  name: string;
  description: string | null;
  image?: string;
  url: string;
  licenseUrl: Observable<string>;
  licenseName: Observable<string>;
  authors: string | null;
  identifiers: ViewIdentifier[];
  citations: ViewCitation[];
  algorithms: Observable<ViewAlgorithm[]>;
  versions: Observable<ViewVersion[]>;
  validated: boolean;
  created: string;
  updated: string;
}
