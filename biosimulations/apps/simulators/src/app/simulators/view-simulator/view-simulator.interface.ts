import { Observable } from 'rxjs';

export interface ViewAlgorithm {
  kisaoId: string;
  heading: string;
  name: string;
  description: DescriptionFragment[] | null;
  kisaoUrl: string;
  frameworks: ViewFramework[];
  modelFormats: ViewFormat[];
  simulationFormats: ViewFormat[];
  archiveFormats: ViewFormat[];
  parameters: ViewParameter[] | null;
  citations: ViewCitation[];
}

export interface ViewAlgorithmObservable {
  kisaoId: string;
  heading: Observable<string>;
  name: Observable<string>;
  description: Observable<DescriptionFragment[]| null>;
  kisaoUrl: Observable<string>;
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
  name: string;
  type: string;
  value: boolean | number | string | null;
  range: (boolean | number | string)[] | null;
  kisaoId: string;
  kisaoUrl: string;
}

export interface ViewParameterObservable {
  name: Observable<string>;
  type: string;
  value: boolean | number | string | Observable<string> | null;
  range: (boolean | number | string | Observable<string>)[] | null;
  kisaoId: string;
  kisaoUrl: string;
}

export interface ViewIdentifier {
  text: string;
  url: string;
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
  curationStatus: string;
}

export interface ViewAuthor {
  name: string;
  orcidUrl: string | null;
}

export interface ViewSimulator {
  _json: string;
  id: string;
  version: string;
  name: string;
  description: string | null;
  image?: string;
  url: string;
  licenseUrl: Observable<string> | null;
  licenseName: Observable<string> | null;
  authors: ViewAuthor[];
  identifiers: ViewIdentifier[];
  citations: ViewCitation[];
  algorithms: Observable<ViewAlgorithm[]>;
  versions: Observable<ViewVersion[]>;
  curationStatus: string;
  created: string;
  updated: string;
}
