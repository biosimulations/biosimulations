/* eslint-disable @typescript-eslint/explicit-member-accessibility */


import {
  EnvironmentVariable,
  Purpose,
  SimulationRunStatus,
} from '@biosimulations/datamodel/common';

export enum JobQueue {
  dispatch = 'dispatch',
  monitor = 'monitor',
  complete = 'complete',
  metadata = 'metadata',
  health = 'health',
}

// TODO project owner should just be a property of the SimulationRun model and not sent in message
export class MonitorJob {
  slurmJobId!: string;
  runId!: string;
  projectId?: string;
  projectOwner?: string;
  retryCount!: number;
}

export class DispatchJob {
  runId!: string;
  simulator!: string;
  version!: string;
  fileName!: string;
  cpus!: number;
  memory!: number;
  maxTime!: number;
  envVars!: EnvironmentVariable[];
  purpose!: Purpose;
  projectId?: string;
  projectOwner?: string;
}

export class CompleteJob {
  runId!: string;
  status!: SimulationRunStatus;
  statusReason!: string;
  projectId?: string;
  projectOwner?: string;
}
