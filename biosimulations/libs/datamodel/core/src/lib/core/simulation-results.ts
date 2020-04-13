import { DTO } from '@biosimulations/datamodel/utils';
import { BiomodelVariableDTO } from '.';
import { BiosimulationsId, DateString } from '../common/alias';

export class SimulationResultVariableCore {
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

export interface SimulationRun {
  startTime: number;
  endTime: number;
  length: number;
  submitDate: DateString;
  runDate: DateString;
  endDate: DateString;
  wallTime: number;
  outlog: LogItemDTO[];
  errlog: LogItemDTO[];
}

export type TimePointDTO = DTO<TimePointCore>;

export type SimulationResultVariableDTO = DTO<SimulationResultVariableCore>;
