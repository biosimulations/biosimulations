import {
  IOntologyTerm,
  Format,
  License,
  AccessLevel,
  Person,
  Identifier,
  Citation,
  BiomodelParameter,
  BiomodelVariable,
  Taxon,
  BiomodelAttributes,
  BiomodelRelationships,
} from '@biosimulations/datamodel/common';

export class Model {
  // Attributes
  taxon: Taxon | null;
  framework: IOntologyTerm;
  format: Format;
  parameters: BiomodelParameter[];
  variables: BiomodelVariable[];

  // Metadata
  id: string;
  name!: string;
  summary!: string;
  description!: string;
  tags!: string[];
  identifiers!: Identifier[];
  refs!: Citation[];
  authors!: Person[];
  license!: License;
  created!: Date;
  updated!: Date;
  access!: AccessLevel;

  // Relationships
  // Relationships
  fileId!: string;
  ownerId!: string;
  imageId!: string;

  constructor(
    id: string,
    metaData: any,
    attributes: BiomodelAttributes,
    relationships: BiomodelRelationships,
  ) {
    this.id = id;
    this.taxon = attributes.taxon;
    this.variables = attributes.variables;
    this.framework = attributes.framework;
    this.format = attributes.format;
    this.parameters = attributes.parameters;
  }
}
