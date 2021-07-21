export interface LabeledIdentifier {
  uri: string | null;
  label: string;
}

export interface DescribedIdentifier extends LabeledIdentifier {
  attribute_uri?: string;
  attribute_label?: string;
}

export interface ArchiveMetadata {
  uri: string;
  title?: string;
  abstract?: string;
  keywords: LabeledIdentifier[];
  thumbnails: string[];
  description?: string;
  taxa: LabeledIdentifier[];
  encodes: LabeledIdentifier[];
  sources: LabeledIdentifier[];
  predecessors: LabeledIdentifier[];
  successors: LabeledIdentifier[];
  seeAlso: LabeledIdentifier[];
  identifiers: LabeledIdentifier[];
  citations: LabeledIdentifier[];
  creators: LabeledIdentifier[];
  contributors: LabeledIdentifier[];
  license?: LabeledIdentifier;
  funders: LabeledIdentifier[];
  created?: Date;
  modified: Date[];
  other: DescribedIdentifier[];
}
