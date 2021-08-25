/* eslint-disable @typescript-eslint/explicit-member-accessibility */

import { EnvironmentVariable } from '@biosimulations/datamodel/common';



export enum JobQueue{
  dispatch = 'dispatch',
  monitor = 'monitor',
  complete = 'complete',
  fail = 'fail',
  metadata='metadata'
}
export class extractMetadataJob {
  simId!: string;
}
export class MonitorJob {
  slurmJobId!: string;
  simId!: string;
}

export class DispatchJob {
  simId!: string;
  simulator!: string;
  version!: string;
  fileName!: string;
  cpus!: number;
  memory!: number;
  maxTime!: number;
  envVars!: EnvironmentVariable[];
}

export class CompleteJob {
  simId!: string;
}

export class FailJob {
  simId!: string;
  reason!: string;
}
