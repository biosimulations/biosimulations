import { ViewModel } from './view';
import {
  BiomodelVariable as IBP,
  ValueType,
  Identifier,
} from '@biosimulations/datamodel/common';

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
      dto.units,
    );
  }
  constructor(
    public target: string,
    public group: string,
    public id: string,
    public name: string | null,
    public description: string | null,
    public identifiers: Identifier[],
    public type: ValueType,

    public units: string,
  ) {
    super();
    this.init();
  }
  toString(): string {
    return name;
  }
  getIcon(): null {
    return null;
  }
  getLink(): string | null {
    return null;
  }
  match(predicate: any): boolean {
    throw new Error('Method not implemented.');
  }
  getTooltip(): string | null {
    return null;
  }
}
