import { ValidationReportLists } from './validation-report.interface';

export interface Metadata {
  archive: CombineArchiveElementMetadata | null;
  other: CombineArchiveElementMetadata[];
  validationReport: ValidationReportLists | null;
}

export interface MetadataValue {
  label: string | null;
  uri: string | null;
}

export interface CustomMetadata {
  attribute: MetadataValue;
  value: MetadataValue;
}

export interface CombineArchiveElementMetadata {
  uri: string | null;
  title: string | null;
  abstract: string | null;
  keywords: string[];
  description: string | null;
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
  license: MetadataValue[];
  funders: MetadataValue[];
  created: string | null;
  modified: string[];
  click?: () => void;
}

export interface FigureTableMetadata {
  uri: string;
  identifier: MetadataValue;
  click?: () => void;
}
