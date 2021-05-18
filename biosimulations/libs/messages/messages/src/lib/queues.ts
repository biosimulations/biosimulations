/* eslint-disable @typescript-eslint/explicit-member-accessibility */
export class MonitorJob {
  slurmJobId!: string;
  simId!: string;
  transpose!: boolean;
}

export class DispatchJob {
  simId!: string;
  simulator!: string;
  version!: string;
  fileName!: string;
  cpus!: number;
  memory!: number;
  maxTime!: number;
}

export class CompleteJob {
  simId!: string;
  transpose!: boolean;
}

export class FailJob {
  simId!: string;
}
