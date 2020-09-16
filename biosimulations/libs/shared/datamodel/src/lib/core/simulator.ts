import { IAlgorithm } from './algorithm';
import { SecondaryResourceMetaData } from '../resources';

export interface SimulatorAttributes {
  name: string;
  version: string;
  url: string;
  dockerHubImageId: string;
  algorithms: IAlgorithm[];
  metadata: SecondaryResourceMetaData;
}
