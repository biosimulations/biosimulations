import { SimulationHDFService } from '@biosimulations/hsds/client';
import { SharedStorageService } from '@biosimulations/shared/storage';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HSDSResultsService {
  getGroups(id: string) {
    return this.results.getGroups(id);
  }
  getResults(simId: string) {
    return this.results.getDatasets(simId);
  }
  public constructor(
    private storage: SharedStorageService,
    private results: SimulationHDFService,
  ) {}

  public getDatasets(id: string) {
    return this.results.getDatasets(id);
  }
}
