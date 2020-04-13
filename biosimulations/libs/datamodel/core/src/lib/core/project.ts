import { DTO } from '@biosimulations/datamodel/utils';
import { JournalReferenceDTO } from '../common';
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

export class ProjectProductCore {
  reference: JournalReferenceDTO;
  type: ProjectProductType;
  label: string;
  description: string;
  resources: BiosimulationsId[];
}
export type ProjectProductDTO = DTO<ProjectProductCore>;
