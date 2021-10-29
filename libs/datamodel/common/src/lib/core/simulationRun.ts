import { SimulationRunLogStatus } from './simulationRunLog';
import { Purpose } from './purpose';
import {
  SedModel,
  SedSimulation,
  SedTask,
  SedDataGenerator,
  SedOutput,
} from '../sedml';
import { LabeledIdentifier, DescribedIdentifier } from './archiveMetadata';
import { SimulationType } from './algorithm';

export enum SimulationRunStatus {
  // The api has created the entry
  CREATED = 'CREATED',
  // The api has submitted the run and service has accepted
  QUEUED = 'QUEUED',
  // The service has starting the run
  RUNNING = 'RUNNING',
  // The simulation is finished running, and results are being created
  PROCESSING = 'PROCESSING',
  // The run has finished
  SUCCEEDED = 'SUCCEEDED',
  // The run has failed
  FAILED = 'FAILED',
}

export const SimulationStatusToSimulationLogStatus = (
  input: SimulationRunStatus,
): SimulationRunLogStatus => {
  switch (input) {
    case SimulationRunStatus.CREATED: {
      return SimulationRunLogStatus.RUNNING;
    }
    case SimulationRunStatus.QUEUED: {
      return SimulationRunLogStatus.QUEUED;
    }
    case SimulationRunStatus.FAILED: {
      return SimulationRunLogStatus.FAILED;
    }
    case SimulationRunStatus.PROCESSING: {
      return SimulationRunLogStatus.RUNNING;
    }
    case SimulationRunStatus.RUNNING: {
      return SimulationRunLogStatus.RUNNING;
    }
    case SimulationRunStatus.SUCCEEDED: {
      return SimulationRunLogStatus.SUCCEEDED;
    }
  }
};

export interface EnvironmentVariable {
  key: string;
  value: string;
}

export interface SimulationRun {
  id: string;
  name: string;
  simulator: string;
  simulatorVersion: string;
  simulatorDigest: string;
  cpus: number;
  memory: number;
  maxTime: number;
  envVars: EnvironmentVariable[];
  purpose: Purpose;
  email: string | null;
  status: SimulationRunStatus;
  statusReason?: string;
  runtime?: number;
  projectSize?: number;
  resultsSize?: number;
  submitted: Date;
  updated: Date;
}

export interface SimulationRunSedDocument {
  id: string;
  simulationRun: string;
  models: SedModel[];
  simulations: SedSimulation[];
  dataGenerators: SedDataGenerator[];
  outputs: SedOutput[];
  tasks: SedTask[];
  created: string;
  updated: string;
}

export interface UploadSimulationRun {
  name: string;
  simulator: string;
  simulatorVersion: string;
  cpus: number;
  memory: number;
  maxTime: number;
  envVars: EnvironmentVariable[];
  purpose: Purpose;
  email: string | null;
  projectId?: string;
}

export interface UploadSimulationRunUrl extends UploadSimulationRun {
  url: string;
}

export interface SimulationRunModelSummary {
  uri: string;
  id: string;
  name?: string;
  source: string;
  language: string;
}

export interface SimulationRunSimulationSummary {
  _type: SimulationType;
  uri: string;
  id: string;
  name?: string;
  algorithm: string;
}

export interface SimulationRunTaskSummary {
  uri: string;
  id: string;
  name?: string;
  model: SimulationRunModelSummary;
  simulation: SimulationRunSimulationSummary;
}

export enum SimulationRunOutputType {
  SedReport = 'SedReport',
  SedPlot2D = 'SedPlot2D',
  SedPlot3D = 'SedPlot3D',
  Vega = 'Vega',
}

export interface SimulationRunOutputSummary {
  _type: SimulationRunOutputType;
  uri: string;
  name?: string;
}

export interface SimulationRunRunSummary {  
  simulator: string;
  simulatorVersion: string;
  simulatorDigest: string;
  cpus: number;
  memory: number;
  envVars: EnvironmentVariable[];
  runtime: number;
  projectSize: number;
  resultsSize: number;  
}

export interface SimulationRunMetadataSummary {
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

export interface SimulationRunSummary {
  id: string;
  name: string;  
  tasks: SimulationRunTaskSummary[];
  outputs: SimulationRunOutputSummary[];
  run: SimulationRunRunSummary;
  metadata: SimulationRunMetadataSummary;
  submitted: string;
  updated: string;
}
