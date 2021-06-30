import { SimulationRunStatus } from '@biosimulations/datamodel/common';

export interface Simulation {
  id: string;
  name: string;
  email?: string;
  submittedLocally?: boolean;
  simulator: string;
  simulatorVersion: string;
  cpus: number;
  memory: number; // GB
  maxTime: number; // min
  status: SimulationRunStatus;
  runtime?: number;
  submitted: Date;
  updated: Date;
  resultsSize?: number;
  projectSize?: number;
}

export interface SedDatasetResults {
  uri: string;
  id: string;
  location: string;
  reportId: string;
  label: string;
  values: (number | boolean | string)[];
}

export interface SedReportResults {
  uri: string;
  id: string;
  datasets: SedDatasetResults[];
}

export interface SedDocumentResults {
  uri: string;
  location: string;
  reports: SedReportResults[];
}

export type CombineResults = SedDocumentResults[];

export interface SedDatasetResultsMap {
  [uri: string]: SedDatasetResults;
}
