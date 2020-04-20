import { AlgorithmDTO } from './algorithm';

export class SimulatorAttributes {
  name: string;
  version: string;
  url: string;
  dockerHubImageId: string;
  algorithms: AlgorithmDTO[];
}
