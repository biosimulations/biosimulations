import {
  BiomodelVariable as BiomodelVariableDTO,
  ValueType,
} from '@biosimulations/datamodel/common';
import { JsonSerializable } from '@biosimulations/datamodel/utils';
import { Identifier } from '@biosimulations/platform/api-models';

export class ModelVariable implements BiomodelVariableDTO {
  target: string;
  group: string;
  description: string | null;
  type: ValueType;
  units: string;
  id: string;
  name: string | null;
  identifiers: Identifier[];
  constructor(data: BiomodelVariableDTO) {
    this.target = data.target;
    this.group = data.group;
    this.description = data.description;
    this.type = data.type;
    this.units = data.units;
    this.id = data.id;
    this.name = data.name;
    this.identifiers = data.identifiers;
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
      identifiers: this.identifiers,
    };
  }
}
