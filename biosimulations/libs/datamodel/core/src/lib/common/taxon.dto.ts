import { DTO } from '@biosimulations/datamodel/utils';

export interface TaxonCore {
  id: number;
  name: string;
}

export type TaxonDTO = DTO<TaxonCore>;
