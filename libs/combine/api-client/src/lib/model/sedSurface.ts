/**
 * BioSimulations COMBINE service
 * Endpoints for working with models (e.g., [CellML](http://cellml.org/), [SBML](http://sbml.org/)), simulation experiments (e.g., [Simulation Experiment Description Language (SED-ML)](http://sed-ml.org/)), metadata ([OMEX Metadata](https://sys-bio.github.io/libOmexMeta/)), and simulation projects ([COMBINE/OMEX archives](https://combinearchive.org/)).  Note, this API may change significantly in the future.
 *
 * The version of the OpenAPI document: 0.1
 * Contact: info@biosimulations.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { SedDataGenerator } from './sedDataGenerator';

/**
 * A surface a 3D plot.
 */
export interface SedSurface {
  /**
   * Unique identifier within its parent SED document.
   */
  id: string;
  /**
   * Brief description.
   */
  name?: string;
  xDataGenerator: SedDataGenerator;
  yDataGenerator: SedDataGenerator;
  zDataGenerator: SedDataGenerator;
  /**
   * Type.
   */
  _type: SedSurfaceType;
}
export enum SedSurfaceType {
  SedSurface = 'SedSurface',
}
