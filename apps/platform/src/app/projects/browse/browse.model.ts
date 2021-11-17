import {
  LabeledIdentifier,
  DescribedIdentifier,
  EnvironmentVariable,
  SimulationRunTaskSummary,
  SimulationRunOutputSummary,
  Account,
} from '@biosimulations/datamodel/common';

export interface FormattedSimulationRunSummary {
  id: string;
  name: string;
  simulator: string;
  simulatorName: string;
  simulatorVersion: string;
  cpus: number;
  memory: number;
  envVars: EnvironmentVariable[];
  runtime: number;
  projectSize: number;
  resultsSize: number;
  submitted: Date;
  updated: Date;
}

export interface FormattedProjectMetadataSummary {
  abstract?: string;
  description?: string;
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
  other: DescribedIdentifier[];
  created: Date;
  modified?: Date;
}

export interface FormattedProjectSummary {
  id: string;
  title: string;
  simulationRun: FormattedSimulationRunSummary;
  tasks: SimulationRunTaskSummary[];
  outputs: SimulationRunOutputSummary[];
  metadata: FormattedProjectMetadataSummary;
  owner?: Account;
  created: Date;
  updated: Date;
}
