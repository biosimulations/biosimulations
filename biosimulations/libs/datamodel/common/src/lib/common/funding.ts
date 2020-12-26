import { IFunderRegistryOntologyId } from './ontology';

export interface Funding {
  funder: IFunderRegistryOntologyId;
  grant: string | null;
  url: string | null;
}
