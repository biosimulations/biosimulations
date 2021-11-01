import { Injectable, Logger } from '@nestjs/common';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { SharedStorageService } from './shared-storage.service';
// hack to get typing to work see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/47780
// eslint-disable-next-line unused-imports/no-unused-imports-ts
import multer from 'multer';
@Injectable()
export class SimulationStorageService {
  private logger = new Logger(SimulationStorageService.name);

  public constructor(private storage: SharedStorageService) {}

  public async extractSimulationArchive(file: string): Promise<any> {
    const s3File = await this.storage.getObject(file);
    this.logger.debug(`Extracting ${file}`);
  }

  public async uploadSimulationArchive(
    runId: string,
    file: Express.Multer.File,
  ): Promise<ManagedUpload.SendData> {
    const filename = file.originalname;
    const s3File = await this.storage.putObject(
      this.getS3FileId(runId),
      file.buffer,
    );
    return s3File;
  }

  public async deleteSimulationArchive(runId: string): Promise<void> {
    await this.storage.deleteObject(
      this.getS3FileId(runId),
    );
  }

  private getS3FileId(runId: string): string {
    return `simulations/${runId}/archive.omex`;
  }
}
