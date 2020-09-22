export enum SimulationStatus {
  queued = 'QUEUED',
  started = 'STARTED',
  succeeded = 'SUCCEEDED',
  failed = 'FAILED',
  running = 'RUNNING',
}

export interface Simulation {
  id: string;
  name: string;
  email?: string;
  submittedLocally?: boolean;
  status: SimulationStatus;
  runtime?: number;
  submitted: Date;
  updated: Date;
}
