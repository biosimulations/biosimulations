import { IAlgorithm } from './algorithm';
import { SecondaryResourceMetaData } from '../resources';

export interface SimulatorAttributes {
  name: string;
  version: string;
  url: string;
  image: string;
  algorithms: IAlgorithm[];
  metadata: SecondaryResourceMetaData;
}
