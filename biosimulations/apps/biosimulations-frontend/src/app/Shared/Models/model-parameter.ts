import { ModelParameterDTO } from '@biosimulations/datamodel/core';
import { JsonSerializable } from '@biosimulations/datamodel/utils';

export class ModelParameter implements JsonSerializable<ModelParameterDTO> {
  id?: string;
  name?: string;
  value?: number;
  units?: string;

  constructor(data: ModelParameterDTO) {
    this.id = data.id;
    this.name = data.name;
    this.value = data.value;
    this.units = data.units;
  }
  serialize(): ModelParameterDTO {
    return {
      id: this.id,
      name: this.name,
      value: this.value,
      units: this.units,
    };
  }
}
