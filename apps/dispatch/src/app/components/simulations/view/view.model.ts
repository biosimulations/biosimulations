import {
  SimulationRunStatus,
  EnvironmentVariable,
  Purpose,
} from '@biosimulations/datamodel/common';

export interface FormattedSimulation {
  id: string;
  name: string;
  simulator: string;
  simulatorVersion: string;
  simulatorDigest: string;
  simulatorUrl: string;
  cpus: number;
  memory: string;
  maxTime: string;
  envVars: EnvironmentVariable[];
  purpose: Purpose;
  status: SimulationRunStatus;
  statusRunning: boolean;
  statusSucceeded: boolean;
  statusFailed: boolean;
  statusLabel: string;
  submitted: string;
  updated: string;
  // runtime: string;
}
