import {
  BiomodelParameter as BiomodelParameterDTO,
  isBiomodelParameter as isBiomodelParameterDTO,
  Identifier as IdentifierDTO,
  ValueType,
} from '@biosimulations/datamodel/common';
import { JsonSerializable } from '@biosimulations/datamodel/utils';
import { Identifier } from './identifier';

export class ModelParameter implements BiomodelParameterDTO {
  id: string;
  name: string | null;
  value: string | null;
  units: string;
  group: string;
  target: string;
  description: string | null;
  identifiers: Identifier[];
  type: ValueType;
  recommendedRange: string[] | null;

  constructor(data: BiomodelParameterDTO) {
    this.id = data.id;
    this.name = data.name;
    this.value = data.value;
    this.units = data.units;
    this.group = data.group;
    this.target = data.target;
    this.description = data.description;
    this.identifiers = [];
    data.identifiers.map((value: IdentifierDTO) =>
      this.identifiers.push(new Identifier(value)),
    );

    this.type = data.type;
    this.recommendedRange = data.recommendedRange;
  }
  serialize(): BiomodelParameterDTO {
    const json = {
      id: this.id,
      name: this.name,
      value: this.value,
      units: this.units,
      group: this.group,
      target: this.target,
      description: this.description,
      identifiers: new Array(),
      type: this.type,
      recommendedRange: this.recommendedRange,
    };
    this.identifiers.map((value: Identifier) => {
      json.identifiers.push(value.serialize());
    });

    return json;
  }
}
