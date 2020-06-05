import { DTO } from '@biosimulations/datamodel/utils';
import { BiomodelVariableDTO } from '.';
import { BiosimulationsId, DateString } from '../common/alias';

export interface SimulationResultVariableCore {
  simulation: BiosimulationsId;
  variable: BiomodelVariableDTO;
}

export enum SimulationResultsFormat {
  csv = 'csv',
  hdf5 = 'hdf5',
  n5 = 'n5',
  numl = 'numl',
  tsv = 'tsv',
  zarr = 'zarr',
}

export interface TimePointCore {
  time: number;
  value: number;
}

export interface LogItemDTO {
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
  outlog: LogItemDTO[];
  errlog: LogItemDTO[];
  status: SimulationStatus;
}
export type SimulationStatus = 'done' | 'submitted' | 'failed';

export type TimePointDTO = DTO<TimePointCore>;

export type SimulationResultVariableDTO = DTO<SimulationResultVariableCore>;
