import { ValueType, SoftwareInterfaceType } from '../common/';
import { Citation } from '../..';

import {
  ISboOntologyId,
  IKisaoOntologyId,
  IEdamOntologyId,
  ISioOntologyId,
} from '../common';

import { DependentPackage } from './dependent-package';

export enum ModelChangeType {
  SedAttributeModelChange = 'SedAttributeModelChange',
  SedAddXmlModelChange = 'SedAddXmlModelChange',
  SedRemoveXmlModelChange = 'SedRemoveXmlModelChange',
  SedChangeXmlModelChange = 'SedChangeXmlModelChange',
  SedComputeAttributeChangeModelChange = 'SedComputeAttributeChangeModelChange',
  SedSetValueAttributeModelChange = 'SedSetValueAttributeModelChange',
}

export enum ModelChangeTypeName {
  SedAttributeModelChange = 'SED attribute model change',
  SedAddXmlModelChange = 'SED add XML model change',
  SedRemoveXmlModelChange = 'SED remove XML model change',
  SedChangeXmlModelChange = 'SED change XML model change',
  SedComputeAttributeChangeModelChange = 'SED statically compute attribute model change',
  SedSetValueAttributeModelChange = 'SED dynamically compute attribute model change',
}

export interface IModelTarget {
  value: string;
  grammar: string;
}

export interface IModelSymbol {
  value: string;
  namespace: string;
}

export interface IModelChangePattern {
  name: string;
  types: ModelChangeType[];
  target: IModelTarget | null;
  symbol: IModelSymbol | null;
}

export enum SimulationType {
  SedOneStepSimulation = 'SedOneStepSimulation',
  SedSteadyStateSimulation = 'SedSteadyStateSimulation',
  SedUniformTimeCourseSimulation = 'SedUniformTimeCourseSimulation',
}

export enum SimulationTypeName {
  SedOneStepSimulation = 'SED one step simulation',
  SedSteadyStateSimulation = 'SED steady state simulation',
  SedUniformTimeCourseSimulation = 'SED uniform time course simulation',
}

export enum SimulationTypeBriefName {
  SedOneStepSimulation = 'One step',
  SedSteadyStateSimulation = 'Steady state',
  SedUniformTimeCourseSimulation = 'Uniform time course',
}

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

export interface IOutputVariablePattern {
  name: string;
  target: IModelTarget | null;
  symbol: IModelSymbol | null;
}

export interface IAlgorithm {
  id: string | null;
  name: string | null;
  kisaoId: IKisaoOntologyId;
  modelingFrameworks: ISboOntologyId[];
  modelFormats: IEdamOntologyId[];
  modelChangePatterns: IModelChangePattern[];
  parameters: AlgorithmParameter[] | null;
  outputDimensions: ISioOntologyId[] | null;
  outputVariablePatterns: IOutputVariablePattern[];
  simulationFormats: IEdamOntologyId[];
  simulationTypes: SimulationType[];
  archiveFormats: IEdamOntologyId[];
  availableSoftwareInterfaceTypes: SoftwareInterfaceType[];
  dependencies: DependentPackage[] | null;
  citations: Citation[];
}

/*
 * // can this be made generic?
 * Perhaps can create a method that takes in a param  as well as new instantiated "core" class
 * would then use reflect to check all parameters? only use case currently is diff between algorithm and model param
 */

export const isAlgorithmParameter = (param: any): param is AlgorithmParameter =>
  'kisaoId' in param && 'id' in param && 'name' in param && 'value' in param;
