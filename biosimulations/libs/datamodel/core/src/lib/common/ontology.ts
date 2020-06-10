import { KisaoId } from './alias';

export enum Ontologies {
  KISAO = 'KISAO',
  SBO = 'SBO',
  EDAM = 'EDAM',
}
export interface OntologyId {
  ontology: string;
  id: string;
}
export interface OntologyTerm extends OntologyId {
  ontology: string;
  id: string;
  name: string;
  description: string | null;
  iri: string | null;
}
export interface KISAOTerm extends OntologyTerm {
  ontology: 'KISAO';
  id: KisaoId;
  name: string;
  description: string;
  iri: string;
}

// Identifiers.org identifier
export interface Identifier {
  namespace: string;
  identifier: string;
  url: string | null;
}
