import { DTO } from '@biosimulations/datamodel/utils';

export interface OntologyTermCore {
  ontology: string;
  id: string;
  name: string;
  description: string;
  iri: string;
}
export type OntologyTermDTO = DTO<OntologyTermCore>;
