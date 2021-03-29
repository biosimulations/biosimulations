import { SimulationRunStatus } from '@biosimulations/datamodel/common';

export interface Simulation {
  id: string;
  name: string;
  email?: string;
  submittedLocally?: boolean;
  simulator: string;
  simulatorVersion: string;
  status: SimulationRunStatus;
  runtime?: number;
  submitted: Date;
  updated: Date;
  resultsSize?: number;
  projectSize?: number;
}

export interface SedDatasetResults {
  _id: string | undefined;
  location: string | undefined;
  reportId: string | undefined;
  label: string;
  value: any;
}

export interface SedReportResults {
  id: string;
  datasets: SedDatasetResults[];
};

export interface SedDocumentResults {
  location: string;
  reports: SedReportResults[];
}

export type CombineResults = SedDocumentResults[];
