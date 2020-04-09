import { ChartDataFieldDTO } from './chart-type-data-field.dto';
import { SimulationResultDTO } from './simulation-result-dto';

export class VisualizationDataFieldDTO {
  dataField: ChartDataFieldDTO;
  simulationResults: SimulationResultDTO[];
}
