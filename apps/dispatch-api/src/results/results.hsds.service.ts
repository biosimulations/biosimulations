import { SimulationHDFService } from '@biosimulations/hsds/client';
import { SharedStorageService } from '@biosimulations/shared/storage';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HSDSResultsService {
  public async getResults(simId: string) {
    const datasets = await this.results.getDatasets(simId);
    const metadata = await this.results.getMetadata(simId);
    const data = {
      metadata,
    };
    return { ...data, reports: datasets };
  }
  public constructor(
    private storage: SharedStorageService,
    private results: SimulationHDFService,
  ) {}
}
