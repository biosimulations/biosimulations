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

