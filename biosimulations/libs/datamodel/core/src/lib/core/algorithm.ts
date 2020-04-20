import { DTO } from '@biosimulations/datamodel/utils';

import { PrimitiveType } from '../common/primitive-type';
import { OntologyTermDTO, FormatDTO, JournalReferenceDTO } from '../..';
import { KisaoId } from '../common/alias';

/**
 * Represents a parameter in a particlar simulation algorith or method.
 * id refers to the identifier used by some software package to refrence parameter
 * type is an enum string to determine what the underling type of the parameter's value is
 * recomendedRange is a sensible value from the original that the parameter can be changed to
 */
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
 * // can this be made generic?
 * Perhaps can create a method that takes in a param  as well as new instantiated "core" class
 * would then use reflect to check all parameters? only use case currently is diff between algorithm and model param
 */

export const isAlgorithmParameterDTO = (
  param: any,
): param is AlgorithmParameterDTO =>
  'kisaoId' in param && 'id' in param && 'name' in param && 'value' in param;
