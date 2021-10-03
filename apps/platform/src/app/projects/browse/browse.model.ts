import { LabeledIdentifier } from '@biosimulations/datamodel/api';

export interface FormattedDate {
  value: Date;
  formattedValue: string;
}

export interface ProjectMetadataSummary {
  title: string;
  abstract?: string;
  thumbnail: string;
  keywords: LabeledIdentifier[];
  taxa: LabeledIdentifier[];
  encodes: LabeledIdentifier[];
  identifiers: LabeledIdentifier[];
  citations: LabeledIdentifier[];
  creators: LabeledIdentifier[];
  contributors: LabeledIdentifier[];
  license?: LabeledIdentifier[];
  funders: LabeledIdentifier[];
  created: FormattedDate;
  modified: FormattedDate[];
}

export interface ProjectSummary {
  id: string;
  metadata: ProjectMetadataSummary;
}
