import { Injectable } from '@nestjs/common';
import { SharedStorageService } from './shared-storage.service';

@Injectable()
export class SimulationStorageService {
  public constructor(private storage: SharedStorageService) {}

  public async uploadSimulationArchive(simId: string, file: any): Promise<any> {
    const filename = file.originalname;
    const s3File = this.storage.putObject(
      `simulations/${simId}/archive.omex`,
      file.buffer,
    );
    return s3File;
  }
}
