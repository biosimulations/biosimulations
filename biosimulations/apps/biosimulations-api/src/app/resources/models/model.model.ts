import {
  ModelDTO,
  ResourceType,
  ModelParameterDTO,
  OntologyTermDTO,
  ModelFormatDTO,
  IdentifierDTO,
  JournalReferenceDTO,
  PersonDTO,
  AccessLevel,
  License,
  TaxonDTO,
} from '@biosimulations/datamodel/core';

export class Model implements ModelDTO {
  type: ResourceType;
  taxon: TaxonDTO;
  parameters: ModelParameterDTO;
  file: string;
  framework: OntologyTermDTO;
  format: ModelFormatDTO;
  id: string;
  owner: string;
  image: string;
  name: string;
  summary: string;
  description: string;
  tags: string[];
  accessToken: string;
  identifiers: IdentifierDTO[];
  references: JournalReferenceDTO[];
  authors: PersonDTO[];
  access: AccessLevel;
  license: License;
  created: Date;
  updated: Date;
}
