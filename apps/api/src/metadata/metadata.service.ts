import { ArchiveMetadata } from '@biosimulations/datamodel/api';
import {
  Injectable,
  Logger,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeleteResult } from 'mongodb';
import { SimulationRunModel } from '../simulation-run/simulation-run.model';
import {
  SimulationRunMetadataModel,
  SimulationRunMetadataIdModel,
} from './metadata.model';
import { FilePaths } from '@biosimulations/shared/storage';

@Injectable()
export class MetadataService {
  private filePaths: FilePaths;
  private logger: Logger = new Logger(MetadataService.name);
  public constructor(
    @InjectModel(SimulationRunMetadataModel.name)
    private simulationRunMetadataModel: Model<SimulationRunMetadataModel>,
    @InjectModel(SimulationRunModel.name)
    private simulationModel: Model<SimulationRunModel>,
    private config: ConfigService,
  ) {
    const env = config.get('server.env');
    this.filePaths = new FilePaths(env);
  }

  public async getAllMetadata(): Promise<
    SimulationRunMetadataIdModel[] | null
  > {
    const metadata = await this.simulationRunMetadataModel.find({}).exec();
    return metadata;
  }

  public async getMetadata(
    runId: string,
  ): Promise<SimulationRunMetadataIdModel | null> {
    const metadata = await this.simulationRunMetadataModel
      .findOne({ simulationRun: runId }, { id: 0, __v: 0 })
      .exec();

    return metadata;
  }

  public async createMetadata(
    runId: string,
    metadata: ArchiveMetadata[],
  ): Promise<void> {
    const sim = await this.simulationModel.findById(runId).catch((_) => null);
    if (!sim) {
      throw new NotFoundException(
        `No simulation run could be found with id '${runId}'.`,
      );
    }

    const simulationRunMetadata = new this.simulationRunMetadataModel({
      simulationRun: runId,
      metadata: metadata.map(this.transformMetadata.bind(this, runId)),
    });
    await simulationRunMetadata.save();
    return;
  }

  public async modifyMetadata(
    runId: string,
    metadata: ArchiveMetadata[],
  ): Promise<SimulationRunMetadataIdModel> {
    const metadataObj = await this.getMetadata(runId);
    if (!metadataObj) {
      throw new NotFoundException(
        `No simulation run could be found with id '${runId}'.`,
      );
    }

    const doc = {
      simulationRun: runId,
      metadata: metadata.map(this.transformMetadata.bind(this, runId)),
      created: metadataObj.created,
    };
    metadataObj.overwrite(doc);

    return metadataObj.save();
  }

  public async deleteSimulationRunMetadata(runId: string): Promise<void> {
    const metadata = await this.simulationRunMetadataModel
      .findOne({ simulationRun: runId })
      .select('simulationRun')
      .exec();
    if (!metadata) {
      throw new NotFoundException(
        `Metadata could not found for simulation run '${runId}'.`,
      );
    }

    const res: DeleteResult = await this.simulationRunMetadataModel
      .deleteOne({ simulationRun: runId })
      .exec();
    if (res.deletedCount !== 1) {
      throw new InternalServerErrorException('Metadata could not be deleted.');
    }
  }

  /*
  public async deleteAllMetadata(): Promise<void> {
    const res: DeleteResult = await this.simulationRunMetadataModel
      .deleteMany({})
      .exec();
    const count = await this.simulationRunMetadataModel.count();
    if (count !== 0) {
      throw new InternalServerErrorException(
        'Some metadata could not be deleted.',
      );
    }
  }
  */
  private transformMetadata(
    runId: string,
    archiveMetadata: ArchiveMetadata,
  ): ArchiveMetadata {
    const currentUri = archiveMetadata.uri;
    if (currentUri.startsWith('./')) {
      archiveMetadata.uri = `${runId}/${encodeURI(currentUri.substring(2))}`;
    } else if (currentUri == '.') {
      archiveMetadata.uri = `${runId}`;
    }
    const thumbnails = archiveMetadata.thumbnails;

    if (thumbnails.length > 0) {
      archiveMetadata.thumbnails = thumbnails.map((thumbnail: string) => {
        if (thumbnail.startsWith('./')) {
          const endpoint = this.filePaths.getSimulationRunFileContentEndpoint(
            true,
            runId,
            thumbnail,
          );

          return endpoint;
        }
        return thumbnail;
      });
    }
    return archiveMetadata;
  }
}
