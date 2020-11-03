import { IAlgorithm } from './algorithm';
import { SecondaryResourceMetaData } from '../resources';

export const simulatorSpecificationsVersions: string[] = ['1.0.0'];
export const SimulatorImageVersions: string[] = ['1.0.0'];

export interface SimulatorAttributes {
  name: string;
  version: string;
  url: string;
  image: string;
  algorithms: IAlgorithm[];
  metadata: SecondaryResourceMetaData;
}
