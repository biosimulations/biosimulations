import { DTO } from '@biosimulations/datamodel/utils';

export interface JournalReferenceCore {
  authors: string;
  title: string;
  journal: string;
  volume: string | number;
  number: number;
  pages: string;
  year: number;
  doi: string;
}
export type JournalReferenceDTO = DTO<JournalReferenceCore>;
