import { DTO } from '@biosimulations/datamodel/utils';
import { PrimitiveType } from '../..';

export class ModelVariableCore {
  target: string;
  group: string;
  id: string;
  name: string;
  description: string;
  type: PrimitiveType;
  units: string;
}
export type BiomodelVariableDTO = DTO<ModelVariableCore>;
