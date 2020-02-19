import { Project } from '../Models/project';
import { Serializer } from './serializer';
import { ProjectProduct } from '../Models/project-product';

export class ProjectSerializer extends Serializer<Project> {
  constructor() {
    super(Project);
  }
  fromJson(json: any): Project {
    const proj = super.fromJson(json);
    proj.products = [];
    json.products.forEach(product => {
      const prod = new ProjectProduct();
      prod.description = product.description;
      prod.label = product.label;
      prod.ref = product.ref;
      prod.type = product.type;
      prod.resourceIds = product.resourceIds;
      proj.products.push(prod);
    });
    return proj;
  }
}
