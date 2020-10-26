import { Identifier } from './ontology';

export interface Citation {
  authors: string;
  title: string;
  journal: string | null;
  volume: string | number | null;
  issue: string | number | null;
  pages: string | null;
  year: number;
  identifiers: Identifier[] | null;
}
