/* eslint-disable @typescript-eslint/explicit-member-accessibility */
export class MonitorJob {
  slurmJobId!: string;
  simId!: string;
}

export interface Environment {
  [key: string]: string;
}

export class DispatchJob {
  simId!: string;
  simulator!: string;
  version!: string;
  fileName!: string;
  cpus!: number;
  memory!: number;
  maxTime!: number;
  env!: Environment;
}

export class CompleteJob {
  simId!: string;
}

export class FailJob {
  simId!: string;
  reason!: string;
}
