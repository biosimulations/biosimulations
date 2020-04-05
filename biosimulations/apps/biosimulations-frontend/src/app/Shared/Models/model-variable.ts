import { ModelVariableDTO } from '@biosimulations/datamodel/core';
import { JsonSerializable } from '@biosimulations/datamodel/utils';

export class ModelVariable implements JsonSerializable<ModelVariableDTO> {
  id?: string;
  name?: string;
  serialize(): ModelVariableDTO {
    return {
      id: this.id,
      name: this.name,
    };
  }
}
