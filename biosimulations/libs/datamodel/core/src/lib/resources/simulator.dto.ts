import { ResourceDTO } from './resource.dto';
import { ResourceType } from '../enums/resource-type';

export class ChartDTO extends ResourceDTO {
  type = ResourceType.simulator;
  version: string;
  url: string;
  dockerHubImageId: string;
  algorithms: Algorithm[];
}
