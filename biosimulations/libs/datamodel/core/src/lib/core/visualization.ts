import { FormatDTO } from '../common';

import { DTO } from '@biosimulations/datamodel/utils';
import { ChartDataFieldDTO, BiomodelVariableDTO } from '.';
import { SimulationId, ChartId } from '../common/alias';

export interface SimulationResult {
  simulation: SimulationId;
  variable: BiomodelVariableDTO;
}

export interface VisualizationDataFieldCore {
  dataField: ChartDataFieldDTO;
  simulationResults: SimulationResult[];
}

export type VisualizationDataFieldDTO = DTO<VisualizationDataFieldCore>;

export interface VisualizationLayoutElementCore {
  chartType: ChartId;
  data: VisualizationDataFieldDTO[];
}

export type VisualizationLayoutElementDTO = DTO<VisualizationLayoutElementCore>;

export interface VisualizationCore {
  format: FormatDTO;
  columns: number;
  layout: VisualizationLayoutElementDTO;
}
