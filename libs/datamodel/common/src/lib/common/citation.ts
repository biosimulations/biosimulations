import { Identifier } from './ontology';

export interface Citation {
  authors: string;
  title: string;
  journal: string | null;
  volume: string | null;
  issue: string | null;
  pages: string | null;
  year: number;
  identifiers: Identifier[];
}
export interface ExternalReferences {
  identifiers: Identifier[];
  citations: Citation[];
}
