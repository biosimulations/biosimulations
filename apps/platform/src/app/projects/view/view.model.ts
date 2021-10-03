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
