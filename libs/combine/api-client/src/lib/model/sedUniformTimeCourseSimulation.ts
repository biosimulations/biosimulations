/**
 * BioSimulations COMBINE service
 * Endpoints for working with COMBINE/OMEX archives and model (e.g., SBML) and simulation (e.g., SED-ML) files that they typically contain.  Note, this API may change significantly in the future.
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
 * A SED uniform time course simulation.
 */
export interface SedUniformTimeCourseSimulation {
  /**
   * Unique identifier within its parent SED document.
   */
  id: string;
  /**
   * Brief description.
   */
  name?: string;
  /**
   * Type of the simulation.
   */
  _type: SedUniformTimeCourseSimulation.TypeEnum;
  /**
   * Initial time.
   */
  initialTime: number;
  /**
   * Output start time.
   */
  outputStartTime: number;
  /**
   * Output end time.
   */
  outputEndTime: number;
  /**
   * Number of steps.
   */
  numberOfSteps: number;
  algorithm: SedAlgorithm;
}
export namespace SedUniformTimeCourseSimulation {
  export type TypeEnum = 'SedUniformTimeCourseSimulation';
  export const TypeEnum = {
    SedUniformTimeCourseSimulation: 'SedUniformTimeCourseSimulation' as TypeEnum,
  };
}
