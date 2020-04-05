import { ResourceDTO } from './resource.dto';
import { ProjectProductDTO } from '../common/project-product.dto';
import { ResourceType } from '../enums/resource-type';

export class ProjectDTO extends ResourceDTO {
  type = ResourceType.project;
  products: ProjectProductDTO[];
}
