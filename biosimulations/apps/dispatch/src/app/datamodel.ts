import { SimulationRunStatus } from '@biosimulations/dispatch/api-models';

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
