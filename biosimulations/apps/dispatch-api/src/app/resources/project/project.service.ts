import { Injectable } from '@nestjs/common';

import { ProjectModel } from './interfaces/project.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel('userProject')
    private readonly projectModel: Model<ProjectModel>
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<ProjectModel> {
    const createProject = new this.projectModel(createProjectDto);
    const result = await createProject.save();
    console.log(result);
    return result;
  }

  async findAll(): Promise<ProjectModel[]>{
      return this.projectModel.find().exec(); 
  }
}
