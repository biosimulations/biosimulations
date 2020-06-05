import { AlgorithmDTO } from './algorithm';

export interface SimulatorAttributes {
  name: string;
  version: string;
  url: string;
  dockerHubImageId: string;
  algorithms: AlgorithmDTO[];
}
