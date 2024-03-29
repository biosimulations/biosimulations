export interface LabeledIdentifier {
  uri: string | null;
  label: string | null;
}

export interface DescribedIdentifier extends LabeledIdentifier {
  attribute_uri: string | null;
  attribute_label: string | null;
}

export interface ArchiveMetadata {
  uri: string;
  title?: string;
  abstract?: string;
  description?: string;
  thumbnails: string[];
  sources: LabeledIdentifier[];
  keywords: LabeledIdentifier[];
  taxa: LabeledIdentifier[];
  encodes: LabeledIdentifier[];
  predecessors: LabeledIdentifier[];
  successors: LabeledIdentifier[];
  seeAlso: LabeledIdentifier[];
  references: LabeledIdentifier[];
  identifiers: LabeledIdentifier[];
  citations: LabeledIdentifier[];
  creators: LabeledIdentifier[];
  contributors: LabeledIdentifier[];
  license?: LabeledIdentifier[];
  funders: LabeledIdentifier[];
  created?: string;
  modified?: string[];
  other: DescribedIdentifier[];
}
