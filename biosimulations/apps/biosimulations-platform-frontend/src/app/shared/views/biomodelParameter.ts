import { ViewModel } from './view';

import {
  BiomodelParameter as IParam,
  PrimitiveType,
  Identifier,
} from '@biosimulations/datamodel/core';
export class BiomodelParameter implements ViewModel, IParam {
  target: string;
  group: string;
  id: string;
  name: string;
  description: string | null;
  identifiers: Identifier[];
  type: PrimitiveType;
  value: string | number | boolean;
  recommendedRange: (string | number | boolean)[];
  units: string;

  constructor(param: IParam) {
    this.target = param.target;
    this.group = param.group;
    this.id = param.id;
    this.name = param.name;
    this.description = param.description;
    this.identifiers = param.identifiers;
    this.type = param.type;
    this.value = param.value;
    this.recommendedRange = param.recommendedRange;
    this.units = param.units;
  }
  toString(): string {
    return this.name;
  }
  icon():
    | 'home'
    | 'file'
    | 'question'
    | 'authors'
    | 'author'
    | 'model'
    | 'taxon'
    | null {
    throw new Error('Method not implemented.');
  }
  link(): string | null {
    // TODO produce a link based on any existing identifiers
    throw new Error('Method not implemented.');
  }
  match(predicate: any): boolean {
    throw new Error('Method not implemented.');
  }
}
