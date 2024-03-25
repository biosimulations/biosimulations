import { SimulationRunLogStatus } from './simulationRunLog';
import { Purpose } from './purpose';
import {
  SerializedSedStyle as SedStyle,
  SerializedSedModel as SedModel,
  SerializedSedSimulation as SedSimulation,
  SerializedSedAbstractTask as SedAbstractTask,
  SerializedSedDataGenerator as SedDataGenerator,
  SerializedSedOutput as SedOutput,
} from '../sedml';
import { LabeledIdentifier, DescribedIdentifier } from './archiveMetadata';
import { File as CommonFile } from './file';

export interface ReRunQueryParams {
  projectUrl?: string;
  simulator?: string;
  simulatorVersion?: string;
  runName?: string;
  files?: CommonFile[];
}

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

export enum SimulationRunStatusName {
  // The api has created the entry
  CREATED = 'created',
  // The api has submitted the run and service has accepted
  QUEUED = 'queued',
  // The service has starting the run
  RUNNING = 'running',
  // The simulation is finished running, and results are being created
  PROCESSING = 'processing results',
  // The run has finished
  SUCCEEDED = 'succeeded',
  // The run has failed
  FAILED = 'failed',
}

export interface SimulationRunStatusReason {
  status: SimulationRunStatus | null;
  reason: string;
}

export const SimulationStatusToSimulationLogStatus = (input: SimulationRunStatus): SimulationRunLogStatus => {
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
  runtime?: number;
  projectSize?: number;
  resultsSize?: number;
  submitted: Date;
  updated: Date;
}

export interface SimulationRunSedDocumentInput {
  id: string;
  level: number;
  version: number;
  styles: SedStyle[];
  models: SedModel[];
  simulations: SedSimulation[];
  dataGenerators: SedDataGenerator[];
  outputs: SedOutput[];
  tasks: SedAbstractTask[];
}

export class SimulationRunSedDocumentInputsContainer {
  sedDocuments!: SimulationRunSedDocumentInput[];
}

export interface SimulationRunSedDocument extends SimulationRunSedDocumentInput {
  simulationRun: string;
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

export interface TypeSummary {
  id: string;
  name: string;
  url: string;
}

export interface SimulationRunModelLanguageSummary {
  name?: string;
  acronym?: string;
  sedmlUrn: string;
  edamId?: string;
  url?: string;
}

export interface SimulationRunAlgorithmSummary {
  kisaoId: string;
  name: string;
  url: string;
}

export interface SimulationRunModelSummary {
  uri: string;
  id: string;
  name?: string;
  source: string;
  language: SimulationRunModelLanguageSummary;
}

export interface SimulationRunSimulationSummary {
  type: TypeSummary;
  uri: string;
  id: string;
  name?: string;
  algorithm: SimulationRunAlgorithmSummary;
}

export interface SimulationRunTaskSummary {
  uri: string;
  id: string;
  name?: string;
  model: SimulationRunModelSummary;
  simulation: SimulationRunSimulationSummary;
}

export enum SimulationRunOutputTypeName {
  SedReport = 'Report',
  SedPlot2D = '2D line plot',
  SedPlot3D = '3D surface plot',
  Vega = 'Vega',
}

export interface SimulationRunOutputSummary {
  type: TypeSummary;
  uri: string;
  name?: string;
}

export interface SimulationRunSimulatorSummary {
  id: string;
  name: string;
  version: string;
  digest: string;
  url: string;
}

export interface SimulationRunRunSummary {
  simulator: SimulationRunSimulatorSummary;
  cpus: number;
  memory: number;
  maxTime: number;
  envVars: EnvironmentVariable[];
  status: SimulationRunStatus;
  runtime?: number;
  projectSize?: number;
  resultsSize?: number;
}

export interface SimulationRunMetadataSummary {
  uri: string;
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
  references: LabeledIdentifier[];
  identifiers: LabeledIdentifier[];
  citations: LabeledIdentifier[];
  creators: LabeledIdentifier[];
  contributors: LabeledIdentifier[];
  license?: LabeledIdentifier[];
  funders: LabeledIdentifier[];
  other: DescribedIdentifier[];
  created?: string;
  modified?: string[];
}

export interface SimulationRunSummary {
  id: string;
  name: string;
  tasks?: SimulationRunTaskSummary[];
  outputs?: SimulationRunOutputSummary[];
  run: SimulationRunRunSummary;
  metadata?: SimulationRunMetadataSummary[];
  submitted: string;
  updated: string;
}
