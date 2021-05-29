import { Format } from '../common';
import { ChartDataField, BiomodelVariable } from '.';
import { SimulationId, ChartId } from '../common/alias';
import { PrimaryResourceMetaData } from '../..';

export interface SimulationResult {
  simulation: SimulationId;
  variable: BiomodelVariable;
}

export interface VisualizationDataField {
  dataField: ChartDataField;
  simulationResults: SimulationResult[];
}

export interface VisualizationLayoutElement {
  chartType: ChartId;
  data: VisualizationDataField[];
}

export interface VisualizationAttributes {
  format: Format;
  columns: number;
  layout: VisualizationLayoutElement;
  meta: PrimaryResourceMetaData;
}
