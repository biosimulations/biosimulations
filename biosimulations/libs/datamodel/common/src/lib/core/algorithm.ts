import { AlgorithmParameterType } from '../common/';
import { IOntologyTerm, Format, Citation } from '../..';

import {
  ISboOntologyId,
  IOntologyId,
  IKisaoOntologyId,
  IEdamOntologyId,
  KisaoTerm,
} from '../common';

/**
 * Represents a parameter in a particular simulation algorith or method.
 * id refers to the identifier used by some software package to reference parameter
 * type is an enum string to determine what the underling type of the parameter's value is
 * recommendedRange is a sensible value from the original that the parameter can be changed to
 */
export interface AlgorithmParameter {
  id: string;
  name: string;
  type: AlgorithmParameterType;
  value: string;
  // Todo make this a conditional type based on value
  recommendedRange: string[] | null;
  kisaoId: IKisaoOntologyId;
}

export interface IAlgorithm {
  id: string;
  name: string;
  kisaoId: IKisaoOntologyId;
  modelingFrameworks: ISboOntologyId[];
  modelFormats: IEdamOntologyId[];
  parameters: AlgorithmParameter[];
  simulationFormats: IEdamOntologyId[];
  archiveFormats: IEdamOntologyId[];
  citations: Citation[];
}

/*
 * // can this be made generic?
 * Perhaps can create a method that takes in a param  as well as new instantiated "core" class
 * would then use reflect to check all parameters? only use case currently is diff between algorithm and model param
 */

export const isAlgorithmParameter = (param: any): param is AlgorithmParameter =>
  'kisaoId' in param && 'id' in param && 'name' in param && 'value' in param;
