import { SimulationRunStatus, SimulationRunStatusName } from '@biosimulations/datamodel/common';
import { EnvironmentVariable, Purpose } from '@biosimulations/datamodel/common';

export interface UnknownSimulation {
  id: string;
  name?: null;
  email?: null;
  submittedLocally?: null;
  simulator?: null;
  simulatorVersion?: null;
  simulatorDigest?: null;
  cpus?: null;
  memory?: null /* GB */;
  maxTime?: null /* min */;
  envVars?: null;
  purpose?: null;
  status?: null;
  runtime?: null;
  submitted?: null;
  updated?: null;
  resultsSize?: null;
  projectSize?: null;
}

export interface Simulation {
  id: string;
  name: string;
  email?: string;
  submittedLocally?: boolean;
  simulator: string;
  simulatorVersion: string;
  simulatorDigest: string;
  cpus: number;
  memory: number /* GB */;
  maxTime: number /* min */;
  envVars: EnvironmentVariable[];
  purpose: Purpose;
  status: SimulationRunStatus;
  runtime?: number;
  submitted: Date | string;
  updated: Date | string;
  resultsSize?: number;
  projectSize?: number;
}

export type ISimulation = Simulation | UnknownSimulation;

export function isUnknownSimulation(simulation: Simulation | UnknownSimulation): boolean {
  return simulation.status === undefined || simulation.status === null;
}

export class SimulationStatusService {
  public static isSimulationStatusRunning(status: SimulationRunStatus | undefined | null): boolean {
    return (
      status === SimulationRunStatus.CREATED ||
      status === SimulationRunStatus.QUEUED ||
      status === SimulationRunStatus.RUNNING ||
      status === SimulationRunStatus.PROCESSING
    );
  }

  public static isSimulationStatusCompleted(status: SimulationRunStatus | undefined | null): boolean {
    return status === SimulationRunStatus.SUCCEEDED || status === SimulationRunStatus.FAILED;
  }

  public static isSimulationStatusSucceeded(status: SimulationRunStatus | undefined | null): boolean {
    return status === SimulationRunStatus.SUCCEEDED;
  }

  public static isSimulationStatusFailed(status: SimulationRunStatus | undefined | null): boolean {
    return status === SimulationRunStatus.FAILED;
  }

  public static getSimulationStatusOrder(status: SimulationRunStatus | undefined | null): number {
    switch (status) {
      case SimulationRunStatus.SUCCEEDED:
        return 0;
      case SimulationRunStatus.PROCESSING:
        return 1;
      case SimulationRunStatus.RUNNING:
        return 2;
      case SimulationRunStatus.QUEUED:
        return 3;
      case SimulationRunStatus.CREATED:
        return 4;
      case SimulationRunStatus.FAILED:
        return 5;
      case undefined:
      case null:
        return 6;
    }
    return NaN;
  }

  public static getSimulationStatusMessage(
    status: SimulationRunStatus | undefined | null,
    upperCaseFirstLetter = false,
    shortMessage = true,
  ): string {
    if (status === undefined || status === null) {
      return 'N/A';
    } else {
      const message = shortMessage ? status : SimulationRunStatusName[status];
      if (upperCaseFirstLetter) {
        return message.substring(0, 1).toUpperCase() + message.substring(1).toLowerCase();
      } else {
        return message.toLowerCase();
      }
    }
  }
}
