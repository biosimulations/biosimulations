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
import { SedAlgorithm } from './sedAlgorithm';

/**
 * A SED one step simulation.
 */
export interface SedOneStepSimulation {
  /**
   * Unique identifier within its parent SED document.
   */
  id: string;
  /**
   * Type of the simulation.
   */
  _type: SedOneStepSimulationType;
  /**
   * Brief description.
   */
  name?: string;
  /**
   * Step size.
   */
  step: number;
  algorithm: SedAlgorithm;
}
export enum SedOneStepSimulationType {
  SedOneStepSimulation = 'SedOneStepSimulation',
}
