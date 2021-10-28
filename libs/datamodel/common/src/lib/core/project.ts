import { LabeledIdentifier, DescribedIdentifier } from './archiveMetadata';
import { EnvironmentVariable } from './simulationRun';
import { SimulationType } from './algorithm';

export interface Project {
  id: string;
  simulationRun: string;
  created: string;
  updated: string;
}

export type ProjectInput = Omit<Project, 'created' | 'updated'>;

export interface ModelSummary {
  uri: string;
  id: string;
  name?: string;
  source: string;
  language: string;
}

export interface SimulationSummary {
  _type: SimulationType;
  uri: string;
  id: string;
  name?: string;
  algorithm: string;
}

export interface SimulationTaskSummary {
  uri: string;
  id: string;
  name?: string;
  model: ModelSummary;
  simulation: SimulationSummary;
}

export enum SimulationOutputType {
  SedReport = 'SedReport',
  SedPlot2D = 'SedPlot2D',
  SedPlot3D = 'SedPlot3D',
  Vega = 'Vega',
}

export interface SimulationOutputSummary {
  _type: SimulationOutputType;
  uri: string;
  name?: string;
}

export interface SimulationRunSummary {
  id: string;
  name: string;
  simulator: string;
  simulatorVersion: string;
  simulatorDigest: string;
  cpus: number;
  memory: number;
  envVars: EnvironmentVariable[];
  runtime: number;
  projectSize: number;
  resultsSize: number;
  submitted: string;
  updated: string;
}

export interface ProjectMetadataSummary {
  title?: string;
  abstract?: string;
  description?: string;
  thumbnails: string[];
  sources: LabeledIdentifier[];
  keywords: LabeledIdentifier[];
  taxa: LabeledIdentifier[];
  encodes: LabeledIdentifier[];
  predecessors: LabeledIdentifier[];
  successors: LabeledIdentifier[];
  seeAlso: LabeledIdentifier[];  
  identifiers: LabeledIdentifier[];
  citations: LabeledIdentifier[];
  creators: LabeledIdentifier[];
  contributors: LabeledIdentifier[];
  license?: LabeledIdentifier[];
  funders: LabeledIdentifier[];
  other: DescribedIdentifier[];
  created: string;
  modified?: string;
}

export interface ProjectSummary {
  id: string;
  simulationTasks: SimulationTaskSummary[];
  simulationOutputs: SimulationOutputSummary[];
  simulationRun: SimulationRunSummary;
  projectMetadata: ProjectMetadataSummary;
  created: string;
  updated: string;
}
