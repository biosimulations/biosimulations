export enum SimulationRunStatus {
  CREATED = 'CREATED',
  QUEUED = 'QUEUED',
  RUNNING = 'RUNNING',  
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',  
}

export interface Simulation {
  id: string;
  name: string;
  email?: string;
  submittedLocally?: boolean;
  simulator: string;
  simulatorVersion: string;
  status: SimulationRunStatus;
  runtime?: number;
  submitted: Date;
  updated: Date;
  resultsSize?: number;
  projectSize?: number;  
}
