import { DTO } from '@biosimulations/datamodel/utils';
import { Type } from '../enums/type';

export interface BiomodelParameterCore {
  target: string;
  group: string;
  id: string;
  name: string;
  description: string;
  identifiers: IdentifierDTO[]; 
  type: Type;
  value: boolean | number | string;
  recommendedRange: (boolean | number | string)[]
  units: string;
}

export type BiomodelParameterDTO = DTO<BiomodelParameterCore>;

export const isBiomodelParameterDTO = (param: any): param is BiomodelParameterDTO =>
  'units' in param && 'id' in param && 'name' in param && 'value' in param;
