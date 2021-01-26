import { ValueType, SoftwareInterfaceType } from '../common/';
import { Citation } from '../..';

import {
  ISboOntologyId,
  IKisaoOntologyId,
  IEdamOntologyId,
  ISioOntologyId,
} from '../common';

/**
 * Represents a parameter in a particular simulation algorith or method.
 * id refers to the identifier used by some software package to reference parameter
 * type is an enum string to determine what the underling type of the parameter's value is
 * recommendedRange is a sensible value from the original that the parameter can be changed to
 */
export interface AlgorithmParameter {
  id: string | null;
  name: string | null;
  type: ValueType;
  value: string | null;
  // Todo make this a conditional type based on value
  recommendedRange: string[] | null;
  availableSoftwareInterfaceTypes: SoftwareInterfaceType[];
  kisaoId: IKisaoOntologyId;
}

export interface IDependentVariableTargetPattern {
  variables: string;
  targetPattern: string;
}

export interface IAlgorithm {
  id: string | null;
  name: string | null;
  kisaoId: IKisaoOntologyId;
  modelingFrameworks: ISboOntologyId[];
  modelFormats: IEdamOntologyId[];
  parameters: AlgorithmParameter[] | null;
  dependentDimensions: ISioOntologyId[] | null;
  dependentVariableTargetPatterns: IDependentVariableTargetPattern[];
  simulationFormats: IEdamOntologyId[];
  archiveFormats: IEdamOntologyId[];
  availableSoftwareInterfaceTypes: SoftwareInterfaceType[];
  citations: Citation[];
}

/*
 * // can this be made generic?
 * Perhaps can create a method that takes in a param  as well as new instantiated "core" class
 * would then use reflect to check all parameters? only use case currently is diff between algorithm and model param
 */

export const isAlgorithmParameter = (param: any): param is AlgorithmParameter =>
  'kisaoId' in param && 'id' in param && 'name' in param && 'value' in param;
