import {
  BiomodelParameter,
  AlgorithmParameter,
  SimulationRunAttributes,
  Algorithm,
} from '.';

import { Format, PrimaryResourceMetaData } from '../..';
import { BiosimulationsId } from '../common/alias';

export interface ParameterChange {
  parameter: BiomodelParameter | AlgorithmParameter;
  value: number;
}

export interface SimulationAttributes {
  model: BiosimulationsId;
  format: Format;
  modelParameterChanges: ParameterChange[];
  algorithmParameterChanges: ParameterChange[];
  algorithm: Algorithm;
  runs: BiosimulationsId[];
  numTimepoints: number;
  outputStartTime: number;
  startTime: number;
  endTime: number;
  meta: PrimaryResourceMetaData;
}

export interface SimulationDispatchSpec {
  simulator: string
  filename: string
  uniqueFilename: string
  filepathOnDataStore: string
}
