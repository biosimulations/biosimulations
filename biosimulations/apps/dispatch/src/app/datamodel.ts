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
  email: string | null;
  submittedLocally: boolean;
  status: SimulationStatus;
  runtime: number | null;
  submitted: Date;
  updated: Date;
  resultSize: number | null;
  projectSize: number | null;
}
