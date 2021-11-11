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
import { SimulationRunOutputDatum } from './simulationRunOutputDatum';

/**
 * Results of a SED-ML output (e.g, report, plot).
 */
export interface SimulationRunOutput {
  /**
   * Type
   */
  _type?: SimulationRunOutputType;
  /**
   * Forward slash-separated tuple of the location of the parent SED-ML document and the id of the output (e.g, `simulation.sedml/report`).
   */
  outputId: string;
  /**
   * Name of the output.
   */
  name?: string;
  /**
   * Type of the output.
   */
  type: SimulationRunOutputType;
  /**
   * Results of the output.
   */
  data: Array<SimulationRunOutputDatum>;
}
export enum SimulationRunOutputType {
  SimulationRunOutput = 'SimulationRunOutput',
}
export enum SimulationRunOutputType {
  SedReport = 'SedReport',
  SedPlot2D = 'SedPlot2D',
  SedPlot3d = 'SedPlot3d',
}
