import {
  BiomodelParameterDTO,
  isBiomodelParameterDTO,
  IdentifierDTO,
  PrimitiveType,
} from '@biosimulations/datamodel/core';
import { JsonSerializable } from '@biosimulations/datamodel/utils';

export class ModelParameter implements JsonSerializable<BiomodelParameterDTO> {
  id?: string;
  name?: string;
  value?: number | string | boolean;
  units?: string;
  group: string;
  target: string;
  description: string;
  identifiers: IdentifierDTO[];
  type: PrimitiveType;
  recomendedRange: (string | number | boolean)[];

  constructor(data: BiomodelParameterDTO) {
    Object.assign(this, data);
  }
  serialize(): BiomodelParameterDTO {
    return {
      id: this.id,
      name: this.name,
      value: this.value,
      units: this.units,
      group: this.group,
      target: this.target,
      description: this.description,
      identifiers: this.identifiers,
      type: this.type,
      recomendedRange: this.recomendedRange,
    };
  }
}
