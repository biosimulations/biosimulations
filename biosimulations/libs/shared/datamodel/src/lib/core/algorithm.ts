import { PrimitiveType } from '../common/primitive-type';
import { IOntologyTerm, Format, JournalReference } from '../..';
import { KisaoId } from '../common/alias';
import {
  ISboOntologyID,
  IOntologyId,
  IKisaoOntologyId,
  IEdamOntologyId,
  KISAOTerm,
} from '../common';

/**
 * Represents a parameter in a particlar simulation algorith or method.
 * id refers to the identifier used by some software package to refrence parameter
 * type is an enum string to determine what the underling type of the parameter's value is
 * recommendedRange is a sensible value from the original that the parameter can be changed to
 */
export interface AlgorithmParameter {
  id: string;
  name: string;
  type: PrimitiveType;
  value: boolean | number | string;
  // Todo make this a conditional type based on value
  recommendedRange: (boolean | number | string)[] | null;
  kisaoId: IKisaoOntologyId;
  kisaoSynonyms: IKisaoOntologyId[];
  characteristics: IOntologyId[];
}

export interface IAlgorithm {
  id: string;
  name: string;
  kisaoId: IKisaoOntologyId;
  kisaoSynonyms: IKisaoOntologyId[];
  characteristics: IOntologyId[];
  modelingFrameworks: ISboOntologyID[];
  modelFormats: IEdamOntologyId[];
  parameters: AlgorithmParameter[];
  simulationFormats: IEdamOntologyId[];
  archiveFormats: IEdamOntologyId[];
  citations: JournalReference[];
}

/*
 * // can this be made generic?
 * Perhaps can create a method that takes in a param  as well as new instantiated "core" class
 * would then use reflect to check all parameters? only use case currently is diff between algorithm and model param
 */

export const isAlgorithmParameter = (param: any): param is AlgorithmParameter =>
  'kisaoId' in param && 'id' in param && 'name' in param && 'value' in param;
