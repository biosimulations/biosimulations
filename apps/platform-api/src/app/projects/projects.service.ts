import { PublishProjectInput } from '@biosimulations/datamodel/api';
import { Injectable } from '@nestjs/common';
import { metadata } from './metadata';
@Injectable()
export class ProjectsService {
  public getProjects() {
    const project1 = this.getProject(1);
    const project2 = this.getProject(1);
    return [project1, project2];
  }
  public saveProject(body: PublishProjectInput) {
    return this.getProject(1);
  }
  public getProject(id: any) {
    const project = {
      id,
      metadata,
      simulationRun: id,
    };

    return project;
  }
}
