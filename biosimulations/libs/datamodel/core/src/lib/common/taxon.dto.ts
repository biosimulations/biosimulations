import { DTO } from '@biosimulations/datamodel/utils';

export interface TaxonCore {
  id: string;
  name: string;
}

export type TaxonDTO = DTO<TaxonCore>;
