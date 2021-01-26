import { Identifier, ValueType, IOntologyTerm, Format } from '../..';
import { Taxon } from '../common/taxon';
import { PrimaryResourceMetaData } from '../resources';
import { BiosimulationsId, UserId } from '../common';

export interface BiomodelParameter {
  target: string;
  group: string;
  id: string;
  name: string | null;
  description: string | null;
  identifiers: Identifier[];
  type: ValueType;
  value: string | null;
  recommendedRange: string[] | null;
  units: string;
}

// See isAlogrithmParameter method also. Used to differentiate between alg paramter
export const isBiomodelParameter = (param: any): param is BiomodelParameter =>
  'units' in param && 'id' in param && 'name' in param && 'value' in param;

export interface BiomodelVariable {
  target: string;
  group: string;
  id: string;
  name: string | null;
  description: string | null;
  type: ValueType;
  units: string;
  identifiers: Identifier[];
}

// TODO include metadata
export interface BiomodelAttributes {
  taxon: Taxon | null;
  parameters: BiomodelParameter[];
  variables: BiomodelVariable[];
  framework: IOntologyTerm;
  format: Format;
}

export interface BiomodelRelationships {
  file: BiosimulationsId;
  owner: UserId;
  image: BiosimulationsId;
}
