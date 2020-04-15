import {
  IdentifierDTO,
  PrimitiveType,
  OntologyTermDTO,
  FormatDTO,
} from '../..';
import { DTO } from '@biosimulations/datamodel/utils';
import { TaxonDTO } from '../common/taxon';

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
// See isAlogrithmParameterDTO method also. Used to differentiate between alg paramter
export const isBiomodelParameterDTO = (
  param: any,
): param is BiomodelParameterDTO =>
  'units' in param && 'id' in param && 'name' in param && 'value' in param;

export class BiomodelVariableCore {
  target: string;
  group: string;
  id: string;
  name: string;
  description: string;
  type: PrimitiveType;
  units: string;
}
export type BiomodelVariableDTO = DTO<BiomodelVariableCore>;

export class BiomodelAttributes {
  taxon: TaxonDTO;
  parameters: BiomodelParameterDTO[];
  variables: BiomodelVariableDTO[];
  file: string;
  framework: OntologyTermDTO;
  format: FormatDTO;
}
