import { DTO } from '@biosimulations/datamodel/utils';
import { KisaoId } from './alias';

enum Ontologies {
  KISAO = 'KISAO',
  SBO = 'SBO',
  EDAM = 'EDAM',
}
interface OntologyIdDTO {
  ontology: string;
  id: string;
}
interface OntologyTermCore extends OntologyIdDTO {
  ontology: string;
  id: string;
  name: string;
  description: string;
  iri: string;
}
export interface KISAOTermCore extends OntologyTermCore {
  ontology: 'KISAO';
  id: KisaoId;
  name: string;
  description: string;
  iri: string;
}

// Identifiers.org identifier
export interface IdentifierCore {
  namespace: string;
  identifier: string;
  url?: string;
}
export type IdentifierDTO = DTO<IdentifierCore>;

export type OntologyTermDTO = DTO<OntologyTermCore>;
