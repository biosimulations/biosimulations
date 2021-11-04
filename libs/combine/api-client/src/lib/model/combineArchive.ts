/**
 * BioSimulations COMBINE API
 * Endpoints for working with models (e.g., [CellML](http://cellml.org/), [SBML](http://sbml.org/)), simulation experiments (e.g., [Simulation Experiment Description Language (SED-ML)](http://sed-ml.org/)), metadata ([OMEX Metadata](https://sys-bio.github.io/libOmexMeta/)), and simulation projects ([COMBINE/OMEX archives](https://combinearchive.org/)).  Note, this API may change significantly in the future.
 *
 * The version of the OpenAPI document: 0.1
 * Contact: info@biosimulations.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { CombineArchiveContent } from './combineArchiveContent';

/**
 * A COMBINE/OMEX archive.
 */
export interface CombineArchive {
  /**
   * The content of the archive
   */
  contents: Array<CombineArchiveContent>;
  /**
   * Type.
   */
  _type: CombineArchiveType;
}
export enum CombineArchiveType {
  CombineArchive = 'CombineArchive',
}
