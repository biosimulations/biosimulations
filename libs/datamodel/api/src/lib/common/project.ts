import { PublishProjectInput } from '.';
import { ArchiveMetadata } from './archiveMetadata';

export class Project extends PublishProjectInput {
  public id!: string;
  public metadata!: ArchiveMetadata[];
  public constructor(id: string, simulationRun: string) {
    super();
    this.id = id;
    this.simulationRun = simulationRun;
  }
}
