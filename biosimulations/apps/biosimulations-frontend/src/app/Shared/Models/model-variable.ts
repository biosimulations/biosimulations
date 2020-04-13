import {
  BiomodelVariableDTO,
  PrimitiveType,
} from '@biosimulations/datamodel/core';
import { JsonSerializable } from '@biosimulations/datamodel/utils';

export class ModelVariable implements JsonSerializable<BiomodelVariableDTO> {
  target: string;
  group: string;
  description: string;
  type: PrimitiveType;
  units: string;
  id?: string;
  name?: string;
  constructor(data: BiomodelVariableDTO) {
    Object.assign(this, data);
  }
  serialize(): BiomodelVariableDTO {
    return {
      target: this.target,
      group: this.group,
      description: this.description,
      type: this.type,
      units: this.units,
      id: this.id,
      name: this.name,
    };
  }
}
