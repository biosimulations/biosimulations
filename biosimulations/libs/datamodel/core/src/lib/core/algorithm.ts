import { DTO } from '@biosimulations/datamodel/utils';

import { PrimitiveType } from '../common/primitive-type';
import { OntologyTermDTO, FormatDTO, JournalReferenceDTO } from '../..';
import { KisaoId } from '../common/alias';

export interface AlgorithmParameterCore {
  id: string;
  name: string;
  type: PrimitiveType;
  value: boolean | number | string;
  // Todo make this a conditional type based on value
  recomendedRange?: (boolean | number | string)[];
  kisaoId: KisaoId;
}

export interface AlgorithmCore {
  id: string;
  name: string;
  kisaoId: KisaoId;
  ontologyTerms: OntologyTermDTO[];
  modelingFrameworks: OntologyTermDTO[];
  modelFormats: FormatDTO[];
  parameters: AlgorithmParameterDTO[];
  simulationFormats: FormatDTO[];
  archiveFormats: FormatDTO[];
  references: JournalReferenceDTO[];
}
export type AlgorithmDTO = DTO<AlgorithmCore>;

export type AlgorithmParameterDTO = DTO<AlgorithmParameterCore>;

/*
 * // TODO can this be made generic?
 * Perhaps can create a method that takes in a param  as well as new instantiated "core" class
 * would then use reflect to check all parameters?
 */

export const isAlgorithmParameterDTO = (
  param: any,
): param is AlgorithmParameterDTO =>
  'kisaoId' in param && 'id' in param && 'name' in param && 'value' in param;
