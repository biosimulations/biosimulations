import { KisaoId } from './alias';

export enum Ontologies {
  KISAO = 'KISAO',
  SBO = 'SBO',
  EDAM = 'EDAM',
  SPDX = 'SPDX',
}

export interface Identifier {
  namespace: string;
  id: string;
}

export interface ISpdxId extends Identifier {
  namespace: Ontologies.SPDX;
  id: string;
}
export interface IOntologyId extends Identifier {
  namespace: Ontologies;
  id: string;
}
export interface IEdamOntologyId extends IOntologyId {
  namespace: Ontologies.EDAM;
  id: string;
}
export interface IKisaoOntologyId extends IOntologyId {
  namespace: Ontologies.KISAO;
  id: string;
}

export interface ISboOntologyID extends IOntologyId {
  namespace: Ontologies.SBO;
  id: string;
}

export interface IOntologyTerm extends IOntologyId {
  namespace: Ontologies;
  id: string;
  iri: string | null;
  url?: string | null;
  name: string | null;
  description: string | null;
}
export interface KISAOTerm extends IOntologyTerm {
  namespace: Ontologies.KISAO;
  id: KisaoId;
  name: string;
  description: string;
  iri: string;
}

// Identifiers.org identifier
