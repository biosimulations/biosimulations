import {
  ProjectFileInput,
  ProjectFileThumbnailInput,
} from '@biosimulations/datamodel/api';
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeleteResult } from 'mongodb';
import { FileModel } from './files.model';
import { SimulationStorageService } from '@biosimulations/shared/storage';
import { Endpoints } from '@biosimulations/config/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FilesService {
  private endpoints: Endpoints;
  private logger = new Logger(FilesService.name);

  public constructor(
    @InjectModel(FileModel.name) private model: Model<FileModel>,
    private storage: SimulationStorageService,
    private configService: ConfigService,
  ) {
    const env = configService.get('server.env');
    this.endpoints = new Endpoints(env);
  }

  public async addThumbnailUrls(
    runId: string,
    fileLocation: string,
    thumbnailUrls: ProjectFileThumbnailInput,
  ): Promise<void> {
    const file = await this.model.findOne({
      simulationRun: runId,
      location: fileLocation,
    });
    if (!file) {
      throw new NotFoundException('File not found');
    }
    file.thumbnailUrls = thumbnailUrls;
    await file.save();
  }
  public async getSimulationRunFiles(runId: string): Promise<FileModel[]> {
    return this.model.find({ simulationRun: runId }).exec();
  }

  public async getFile(
    runId: string,
    fileLocation: string,
  ): Promise<FileModel | null> {
    return this.model.findOne({
      $or: [
        { id: this.getFileId(runId, fileLocation, true) },
        { id: this.getFileId(runId, fileLocation, false) },
      ],
    });
  }

  public async createFiles(
    runId: string,
    files: ProjectFileInput[],
  ): Promise<void> {
    await Promise.all(
      files.map((file) => {
        const fileModel = new this.model(file);
        fileModel.simulationRun = runId;
        return fileModel.save();
      }),
    );
    return;
  }

  /*
  public async deleteAllFiles(): Promise<void> {
    const res: DeleteResult = await this.model
      .deleteMany({})
      .exec();
    const count = await this.model.count();
    if (count !== 0) {
      throw new InternalServerErrorException(
        'Some files could not be deleted.',
      );
    }
  }
  */

  public async deleteSimulationRunFiles(runId: string): Promise<void> {
    const files = await this.model
      .find({ simulationRun: runId })
      .select('location')
      .exec();

    await Promise.all(
      files.map((file) => {
        return this.deleteFile(runId, file.location);
      }),
    );

    await this.storage
      .deleteSimulationRunFile(runId, 'manifest.xml')
      .catch((error: any) => {
        if (
          !(
            error.statusCode === HttpStatus.NOT_FOUND &&
            error.code === 'NoSuchKey'
          )
        ) {
          throw error;
        }
      });
  }

  public async deleteFile(runId: string, fileLocation: string): Promise<void> {
    const file = await this.model
      .findOne({
        $or: [
          { id: this.getFileId(runId, fileLocation, true) },
          { id: this.getFileId(runId, fileLocation, false) },
        ],
      })
      .select('id')
      .exec();
    if (!file) {
      throw new NotFoundException(
        `A file could not found for simulation run '${runId}' and location '${fileLocation}'.`,
      );
    }

    await this.storage.deleteSimulationRunFile(runId, fileLocation);

    const res: DeleteResult = await this.model
      .deleteOne({ id: file.id })
      .exec();
    if (res.deletedCount !== 1) {
      throw new InternalServerErrorException('File could not be deleted.');
    }
  }

  private getFileId(
    runId: string,
    fileLocation: string,
    includeInitialRelPath = false,
  ): string {
    if (fileLocation.startsWith('./')) {
      fileLocation = fileLocation.substring(2);
    }
    return runId + '/' + (includeInitialRelPath ? './' : '') + fileLocation;
  }
}
