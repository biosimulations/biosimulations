import { SimulationRunSummary } from './simulationRun';

export interface Project {
  id: string;
  simulationRun: string;
  created: string;
  updated: string;
}

export interface ProjectInput extends Omit<Project, 'created' | 'updated'> {
  owner?: string;
}

export interface Organization {
  id: string;
  name: string;
  url?: string;
}

export enum AccountType {
  user = 'user',
  machine = 'machine',
}

export interface Account {
  type: AccountType;
  id: string;
  name: string;
  url?: string;
  organizations: Organization[];
}

export interface ProjectSummary {
  id: string;
  simulationRun: SimulationRunSummary;
  owner?: Account;
  created: string;
  updated: string;
}

export interface ProjectSummaryQueryResults {
  projectSummaries: ProjectSummary[];
  totalMatchingProjectSummaries: number;
  queryStats: ProjectFilterStatsItem[];
}

export enum ProjectFilterTarget {
  biology = 'biology',
  taxa = 'taxa',
  citations = 'citations',
  keywords = 'keywords',
  modelFormats = 'modelFormats',
  simulationTypes = 'simulationTypes',
  simulationAlgorithms = 'simulationAlgorithms',
  simulator = 'simulator',
  reports = 'reports',
}

export interface ProjectFilterQueryItem {
  target: ProjectFilterTarget;
  allowable_values: string[]; // here 'true' and 'false' are used for booleans.
}

export interface ProjectFilterStatsItem {
  target: ProjectFilterTarget;
  valueFrequencies: {
    value: string;
    count: number;
  }[];
}
