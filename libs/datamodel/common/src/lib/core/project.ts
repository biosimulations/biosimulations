import { Citation } from '../common';
import { BiosimulationsId } from '../common/alias';

export enum ProjectProductType {
  figure = 'figure',
  table = 'table',
  box = 'box',
  algorithm = 'algorithm',
  supplement = 'supplement',
  other = 'other',
}

export const projectProductTypes = [
  { value: ProjectProductType.box, name: 'box' },
  { value: ProjectProductType.figure, name: 'figure' },
  { value: ProjectProductType.table, name: 'table' },
  { value: ProjectProductType.supplement, name: 'supplement' },
  { value: ProjectProductType.algorithm, name: 'algorithm' },
  { value: ProjectProductType.other, name: 'other' },
];

export interface ProjectProduct {
  reference: Citation;
  type: ProjectProductType;
  label: string;
  description: string;
  resources: BiosimulationsId[];
}

export interface ProjectAttributes {
  products: ProjectProduct[];
}
