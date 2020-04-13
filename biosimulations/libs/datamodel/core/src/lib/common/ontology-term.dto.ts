import { DTO } from '@biosimulations/datamodel/utils';
import { KisaoId } from '../aliases/identity';

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
export type OntologyTermDTO = DTO<OntologyTermCore>;
