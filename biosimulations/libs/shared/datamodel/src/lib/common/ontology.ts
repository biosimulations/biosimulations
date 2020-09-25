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
export interface IdentifierTerm extends Identifier {
  namespace: Ontologies;
  id: string;
  name: string;
  description: string;
  url: string;
}
export interface KISAOTerm extends IKisaoOntologyId {
  namespace: Ontologies.KISAO;
  id: KisaoId;
  name: string;
  description: string;
  iri: string;
  url: string;
}

export interface SBOTerm extends IOntologyTerm {
  namespace: Ontologies.SBO;
  id: KisaoId;
  name: string;
  description: string;
  iri: string;
  url: string;
}

export interface EDAMTerm extends IOntologyTerm {
  namespace: Ontologies.EDAM;
  id: KisaoId;
  name: string;
  description: string;
  iri: string;
  url: string;
}

export interface SPDXTerm extends IdentifierTerm {
  namespace: Ontologies.SPDX;
  id: KisaoId;
  name: string;
  description: string;
  url: string;
}
// Identifiers.org identifier
