import { ArchiveMetadata } from './archiveMetadata';

export class SimulationRunMetadata {
  public id!: string;
  public metadata!: ArchiveMetadata[];
  public simulationRun: string;
  public constructor(id: string, simulationRun: string) {

    this.id = id;
    this.simulationRun = simulationRun;
  }
}
