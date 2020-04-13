import { ChartDTO } from '../resources/chart.dto';
import { VisualizationDataFieldDTO } from './visualization-data-field.dto';

export class VisualizationLayoutElementDTO {
  chart: ChartDTO;
  data: VisualizationDataFieldDTO[];
}
