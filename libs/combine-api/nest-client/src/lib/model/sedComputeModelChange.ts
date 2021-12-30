/**
 * BioSimulations COMBINE API
 * Endpoints for working with models (e.g., [CellML](https://cellml.org/), [SBML](http://sbml.org/)), simulation experiments (e.g., [Simulation Experiment Description Language (SED-ML)](https://sed-ml.org/)), metadata ([OMEX Metadata](https://sys-bio.github.io/libOmexMeta/)), and simulation projects ([COMBINE/OMEX archives](https://combinearchive.org/)).  Note, this API may change significantly in the future.
 *
 * The version of the OpenAPI document: 0.1
 * Contact: info@biosimulations.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { SedParameter } from './sedParameter';
import { SedVariable } from './sedVariable';
import { SedTarget } from './sedTarget';

/**
 * Change an attribute of an element of a model based on a calculation
 */
export interface SedComputeModelChange {
  /**
   * Type.
   */
  _type: SedComputeModelChangeTypeEnum;
  target: SedTarget;
  /**
   * Unique identifier within its parent SED-ML document.
   */
  id?: string;
  /**
   * Brief description
   */
  name?: string;
  /**
   * Parameters.
   */
  parameters: Array<SedParameter>;
  /**
   * Variables.
   */
  variables: Array<SedVariable>;
  /**
   * Mathematical expression for its new value.
   */
  math: string;
}
export enum SedComputeModelChangeTypeEnum {
  SedComputeModelChange = 'SedComputeModelChange',
}
