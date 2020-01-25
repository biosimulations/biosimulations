import { Project } from '../Models/project';
import { Serializer } from './serializer';

export class ProjectSerializer extends Serializer<Project> {
  constructor() {
    super();
  }
  fromJson(json: any): Project {
    const res = super.fromJson(json);
    const proj = Object.assign(new Project(), res);
    proj.products = json.products;
    return proj;
  }
}
