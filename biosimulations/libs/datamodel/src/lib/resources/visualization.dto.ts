import { VisualizationLayoutElementDTO } from '../common/visualization-layout-element.dto';
import { ResourceDTO } from './resource.dto';

export class VisaualizationDTO extends ResourceDTO {
  columns: number;
  layout: VisualizationLayoutElementDTO;
}
