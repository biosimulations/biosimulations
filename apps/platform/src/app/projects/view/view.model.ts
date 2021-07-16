export interface MetadataValue {
  _type?: 'BioSimulationsMetadataValue';
  label: string | null;
  uri: string | null;
}

export interface CustomMetadata {
  attribute: MetadataValue;
  value: MetadataValue;
}

export interface CombineArchiveElementMetadata {
  _type?: string;
  uri: string;
  title: string;
  abstract: string;
  keywords: MetadataValue[];
  description: string;
  thumbnails: string[];
  taxa: MetadataValue[];
  encodes: MetadataValue[];
  sources: MetadataValue[];
  predecessors: MetadataValue[];
  successors: MetadataValue[];
  seeAlso: MetadataValue[];
  other: CustomMetadata[];
  creators: MetadataValue[];
  contributors: MetadataValue[];
  identifiers: MetadataValue[];
  citations: MetadataValue[];
  license: MetadataValue;
  funders: MetadataValue[];
  created: string;
  modified: string[];
}
