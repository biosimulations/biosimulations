import { IAlgorithm } from './algorithm';
import { SecondaryResourceMetaData } from '../resources';

export simulatorSpecificationsVersions = ['1.0.0'];
export SimulatorImageVersions = ['1.0.0'];

export interface SimulatorAttributes {
  name: string;
  version: string;
  url: string;
  image: string;
  algorithms: IAlgorithm[];
  metadata: SecondaryResourceMetaData;
}
