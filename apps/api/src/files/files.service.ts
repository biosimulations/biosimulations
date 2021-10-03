import { SubmitProjectFile } from '@biosimulations/datamodel/api';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileModel } from './files.model';
@Injectable()
export class FilesService {
  public constructor(
    @InjectModel(FileModel.name) private model: Model<FileModel>,
  ) {}

  public async getSimulationFiles(simId: string) {
    return await this.model.find({ simulationRun: simId }).exec();
  }

  public async getFile(fileId: string) {
    return await this.model.findOne({ id: fileId });
  }
  public async createFiles(files: SubmitProjectFile[]) {
    const createdFiles = [];
    for (const file of files) {
      const fileModel = new this.model(file);
      createdFiles.push(fileModel.save());
    }
    return Promise.all(createdFiles);
  }
}
