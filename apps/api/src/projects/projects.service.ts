import { ProjectInput } from '@biosimulations/datamodel/api';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SimulationRunModel } from '../simulation-run/simulation-run.model';
import { ProjectModel } from './project.model';

@Injectable()
export class ProjectsService {
  private logger = new Logger('ProjectsService');
  public constructor(
    @InjectModel(ProjectModel.name) private model: Model<ProjectModel>,
    @InjectModel(SimulationRunModel.name)
    private simulationModel: Model<SimulationRunModel>,
  ) {}

  public async getProjects(): Promise<ProjectModel[]> {
    return await this.model.find({});
  }

  public async getProject(id: string): Promise<ProjectModel | null> {
    this.logger.log(`Fetching project ${id}`);
    const proj = await this.model.findOne({ id });
    return proj;
  }

  public async createProject(project: ProjectInput): Promise<ProjectModel> {
    const createdProject = new this.model(project);
    return await createdProject.save();
  }

  public async updateProject(
    projectId: string,
    project: ProjectInput,
  ): Promise<ProjectModel | null> {
    const res = await this.model.findOne({ id: projectId });

    if (res) {
      res.set(project);
      return await res.save();
    }
    return res;
  }

  public async deleteProjects(): Promise<void> {
    // delete all projects
    const res = await this.model.deleteMany({});
    if (res.ok) {
      return;
    }
    throw new Error('Could not delete projects');
  }

  public async deleteProject(projectId: string): Promise<void> {
    const res = await this.model.deleteOne({ id: projectId });
    if (res.ok) {
      return;
    }
    throw new Error('Could not delete project');
  }
}
