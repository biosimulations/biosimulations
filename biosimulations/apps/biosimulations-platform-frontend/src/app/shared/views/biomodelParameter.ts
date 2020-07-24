import { ViewModel } from './view';

import {
  BiomodelParameter as IParam,
  PrimitiveType,
  Identifier,
} from '@biosimulations/datamodel/core';
export class BiomodelParameter extends ViewModel {
  constructor(
    public target: string,
    public group: string,
    public id: string,
    public name: string,
    public identifiers: Identifier[],
    public type: PrimitiveType,
    public value: string | number | boolean,
    public recommendedRange: (string | number | boolean)[],
    public units: string,
    public descrption: string | null,
  ) {
    super();
    this.init();
  }

  static fromDto(param: IParam) {
    return new BiomodelParameter(
      param.target,
      param.group,
      param.id,
      param.name,
      param.identifiers,
      param.type,
      param.value,
      param.recommendedRange,
      param.units,
      param.description,
    );
  }

  getIcon(): null {
    return null;
  }
  getLink(): string | null {
    return null;
  }
  getTooltip(): string | null {
    return null;
  }
  toString(): string {
    return this.name;
  }

  match(predicate: any): boolean {
    throw new Error('Method not implemented.');
  }
}
