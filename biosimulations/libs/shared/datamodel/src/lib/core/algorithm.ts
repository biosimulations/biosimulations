import { PrimitiveType } from '../common/primitive-type';
import { OntologyTerm, Format, JournalReference } from '../..';
import { KisaoId } from '../common/alias';

/**
 * Represents a parameter in a particlar simulation algorith or method.
 * id refers to the identifier used by some software package to refrence parameter
 * type is an enum string to determine what the underling type of the parameter's value is
 * recomendedRange is a sensible value from the original that the parameter can be changed to
 */
export interface AlgorithmParameter {
  id: string;
  name: string;
  type: PrimitiveType;
  value: boolean | number | string;
  // Todo make this a conditional type based on value
  recomendedRange: (boolean | number | string)[] | null;
  kisaoId: KisaoId | null;
}

export interface Algorithm {
  id: string;
  name: string;
  kisaoId: KisaoId;
  ontologyTerms: OntologyTerm[];
  modelingFrameworks: OntologyTerm[];
  modelFormats: Format[];
  parameters: AlgorithmParameter[];
  simulationFormats: Format[];
  archiveFormats: Format[];
  references: JournalReference[];
}

/*
 * // can this be made generic?
 * Perhaps can create a method that takes in a param  as well as new instantiated "core" class
 * would then use reflect to check all parameters? only use case currently is diff between algorithm and model param
 */

export const isAlgorithmParameter = (param: any): param is AlgorithmParameter =>
  'kisaoId' in param && 'id' in param && 'name' in param && 'value' in param;
