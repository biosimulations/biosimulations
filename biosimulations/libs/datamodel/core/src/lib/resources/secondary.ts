import { SecondaryResourceDTO, ResourceType } from '.';
import { SimulatorAttributes } from '../core/simulator';

export interface SimulatorResourceDTO extends SecondaryResourceDTO {
  type: ResourceType.simulationRun;
  attributes: SimulatorAttributes;
}
