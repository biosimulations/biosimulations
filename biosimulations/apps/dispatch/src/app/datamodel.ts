export enum SimulationStatus {
  queued = 'queued',
  started = 'started',
  succeeded = 'succeeded',
  failed = 'failed',
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
