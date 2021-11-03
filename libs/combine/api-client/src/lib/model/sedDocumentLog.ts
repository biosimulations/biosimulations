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
import { SedTaskLog } from './sedTaskLog';
import { SedPlot2DLog } from './sedPlot2DLog';
import { SedPlot3DLog } from './sedPlot3DLog';
import { SedReportLog } from './sedReportLog';
import { Exception } from './exception';

export interface SedDocumentLog {
  location: string;
  status: SedDocumentLogStatus;
  exception: Exception | null;
  skipReason: Exception | null;
  output: string | null;
  duration: number | null;
  tasks: Array<SedTaskLog> | null;
  outputs: Array<SedReportLog | SedPlot2DLog | SedPlot3DLog> | null;
}
export enum SedDocumentLogStatus {
  Queued = 'QUEUED',
  Running = 'RUNNING',
  Skipped = 'SKIPPED',
  Succeeded = 'SUCCEEDED',
  Failed = 'FAILED',
  Unknown = 'UNKNOWN',
}
