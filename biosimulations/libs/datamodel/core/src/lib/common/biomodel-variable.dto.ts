import { DTO } from '@biosimulations/datamodel/utils';
import { Type } from '../enums/type';

export class BiomodelVariableCore {
  target: string:
  group: string;  
  id: string;
  name: string;
  description: string;
  type: Type;
  units: string;
}
export type BiomodelVariableDTO = DTO<BiomodelVariableCore>;
