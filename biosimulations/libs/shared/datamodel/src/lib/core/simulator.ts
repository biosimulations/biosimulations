import { Algorithm } from './algorithm';
import { SecondaryResourceMetaData } from '../resources';

export interface SimulatorAttributes {
  name: string;
  version: string;
  url: string;
  dockerHubImageId: string;
  algorithms: Algorithm[];
  metadata: SecondaryResourceMetaData;
}
