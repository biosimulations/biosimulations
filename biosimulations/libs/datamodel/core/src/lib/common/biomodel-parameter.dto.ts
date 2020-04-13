import { DTO } from '@biosimulations/datamodel/utils';
import { IdentifierDTO } from './identifier.dto';
import { PrimitiveType } from '../enums';

export interface BiomodelParameterCore {
  target: string;
  group: string;
  id: string;
  name: string;
  description?: string;
  identifiers: IdentifierDTO[];
  type: PrimitiveType;
  value: number | string | boolean;
  recomendedRange: (boolean | string | number)[];
  units: string;
}

export type BiomodelParameterDTO = DTO<BiomodelParameterCore>;

export const isBiomodelParameterDTO = (
  param: any,
): param is BiomodelParameterDTO =>
  'units' in param && 'id' in param && 'name' in param && 'value' in param;
