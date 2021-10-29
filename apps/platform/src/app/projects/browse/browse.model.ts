import {
  LabeledIdentifier,
  EnvironmentVariable,
} from '@biosimulations/datamodel/common';

export interface FormattedDate {
  value: Date;
  formattedValue: string;
}

export interface FormattedSimulationRunSummary {
  id: string;
  name: string;
  simulator: string;
  simulatorVersion: string;
  cpus: number;
  memory: number;
  envVars: EnvironmentVariable[];
  runtime: number;
  projectSize: number;
  resultsSize: number;
  submitted: FormattedDate;
  updated: FormattedDate;
}

export interface FormattedProjectMetadataSummary {
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
  modified?: FormattedDate;
}

export interface FormattedProjectSummary {
  id: string;
  title: string;
  simulationRun: FormattedSimulationRunSummary;
  metadata: FormattedProjectMetadataSummary;
  created: FormattedDate;
  updated: FormattedDate;
}
