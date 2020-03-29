import { ResourceDTO } from './resource.dto';
import { ResourceType } from '../enums/resource-type';

export class ChartTypeDTO extends ResourceDTO {
  // TODO decide on the name for this. Chart or chart-type. Should be same name as cache key
  type = ResourceType.chart;
  spec: any;
}
