import { ResourceType } from '.';
import { SimulatorAttributes } from '../core/simulator';
import { BiosimulationsId } from '../common';

export interface SimulatorResource {
  type: ResourceType.simulationRun;
  id: BiosimulationsId;
  attributes: SimulatorAttributes;
}
