import { BiomodelVariable } from '.';
import { BiosimulationsId, DateString } from '../common/alias';
import { PrimaryResourceMetaData } from '../..';

export interface SimulationResultVariable {
  simulation: BiosimulationsId;
  variable: BiomodelVariable;
}

export enum SimulationResultsFormat {
  csv = 'csv',
  hdf5 = 'hdf5',
  n5 = 'n5',
  numl = 'numl',
  tsv = 'tsv',
  zarr = 'zarr',
}

export interface TimePoint {
  time: number;
  value: number;
}

export interface LogItem {
  time: DateString;
  type: string;
  message: string;
}

export interface SimulationRunAttributes {
  simulation: BiosimulationsId;
  simulator: BiosimulationsId;
  inputFile: BiosimulationsId;
  outputFile: BiosimulationsId;
  submitDate: DateString;
  runDate: DateString;
  endDate: DateString;
  wallTime: number;
  outlog: LogItem[];
  errlog: LogItem[];
  status: SimulationStatus;
  metadata: PrimaryResourceMetaData;
}

export enum SimulationStatus {
  CREATED = 'CREATED',
  QUEUED = 'QUEUED',
  RUNNING = 'RUNNING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  // UNKNOWN = 'UNKNOWN',
  CANCELLED = 'CANCELLED',
}

export function isSimulationStatusRunning (status: SimulationStatus): boolean {
  return (
    status === SimulationStatus.CREATED 
    || status === SimulationStatus.QUEUED 
    || status === SimulationStatus.RUNNING
  );
}

export function isSimulationStatusSucceeded (status: SimulationStatus): boolean {
  return status === SimulationStatus.SUCCEEDED;
}

export function isSimulationStatusFailed (status: SimulationStatus): boolean {
  return (
    status === SimulationStatus.FAILED 
    || status === SimulationStatus.CANCELLED
  );
}

export function getSimulationStatusOrder(status: SimulationStatus): number {
  switch (status) {
    case SimulationStatus.CREATED: return 0;
    case SimulationStatus.QUEUED: return 1;
    case SimulationStatus.RUNNING: return 2;
    case SimulationStatus.SUCCEEDED: return 3;
    case SimulationStatus.CANCELLED: return 4;
    case SimulationStatus.FAILED: return 5;
  }
  return NaN;
}

export function getSimulationStatusMessage(status: SimulationStatus, upperCaseFirstLetter=false): string {
  if (upperCaseFirstLetter) {
    return status.substring(0, 1).toUpperCase() + status.substring(1).toLowerCase();    
  } else {
    return status.toLowerCase();
  }
}