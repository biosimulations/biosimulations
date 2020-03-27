import { ResourceDTO } from './resource.dto';
import { ProjectProductDTO } from '../common/project-product.dto';

export class ProjectDTO extends ResourceDTO {
  products: ProjectProductDTO[];
}
