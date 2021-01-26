import { BiomodelParameter, AlgorithmParameter, IAlgorithm } from '.';

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
  algorithm: IAlgorithm;
  runs: BiosimulationsId[];
  numTimepoints: number;
  outputStartTime: number;
  startTime: number;
  endTime: number;
  meta: PrimaryResourceMetaData;
}
