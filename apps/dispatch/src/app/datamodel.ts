import {
  SimulationRunStatus,
  EnvironmentVariable,
} from '@biosimulations/datamodel/common';

export interface Simulation {
  id: string;
  name?: string | null;
  email?: string | null;
  submittedLocally?: boolean | null;
  simulator?: string | null;
  simulatorVersion?: string | null;
  cpus?: number | null;
  memory?: number | null; // GB
  maxTime?: number | null; // min
  envVars?: EnvironmentVariable[] | null;
  status?: SimulationRunStatus | null;
  runtime?: number | null;
  submitted?: Date | null;
  updated?: Date | null;
  resultsSize?: number | null;
  projectSize?: number | null;
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
