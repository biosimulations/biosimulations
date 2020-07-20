import { ViewModel } from './view';
import {
  BiomodelParameter as IBP,
  PrimitiveType,
  Identifier,
} from '@biosimulations/datamodel/core';

export class BiomodelVariable extends ViewModel implements IBP {
  static fromDTO(dto: IBP): BiomodelVariable {
    return new BiomodelVariable(
      dto.target,
      dto.group,
      dto.id,
      dto.name,
      dto.description,
      dto.identifiers,
      dto.type,
      dto.value,
      dto.recommendedRange,
      dto.units,
    );
  }
  constructor(
    public target: string,
    public group: string,
    public id: string,
    public name: string,
    public description: string | null,
    public identifiers: Identifier[],
    public type: PrimitiveType,
    public value: string | number | boolean,
    public recommendedRange: (string | number | boolean)[],
    public units: string,
  ) {
    super();
    this.init();
  }
  toString(): string {
    return name;
  }
  getIcon(): null {
    throw new Error('Method not implemented.');
  }
  getLink(): string | null {
    throw new Error('Method not implemented.');
  }
  match(predicate: any): boolean {
    throw new Error('Method not implemented.');
  }
  getTooltip(): string | null {
    throw new Error('Method not implemented.');
  }
}
