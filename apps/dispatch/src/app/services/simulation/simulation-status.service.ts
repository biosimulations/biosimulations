import { SimulationRunStatus } from '@biosimulations/datamodel/common';

export class SimulationStatusService {
  public static isSimulationStatusRunning(
    status: SimulationRunStatus | undefined | null,
  ): boolean {
    return (
      status === SimulationRunStatus.CREATED ||
      status === SimulationRunStatus.QUEUED ||
      status === SimulationRunStatus.RUNNING ||
      status === SimulationRunStatus.PROCESSING
    );
  }

  public static isSimulationStatusCompleted(
    status: SimulationRunStatus | undefined | null,
  ): boolean {
    return (
      status === SimulationRunStatus.SUCCEEDED ||
      status === SimulationRunStatus.FAILED
    );
  }

  public static isSimulationStatusSucceeded(
    status: SimulationRunStatus | undefined | null,
  ): boolean {
    return status === SimulationRunStatus.SUCCEEDED;
  }

  public static isSimulationStatusFailed(
    status: SimulationRunStatus | undefined | null,
  ): boolean {
    return status === SimulationRunStatus.FAILED;
  }

  public static getSimulationStatusOrder(
    status: SimulationRunStatus | undefined | null,
  ): number {
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
  ): string {
    if (status === undefined || status === null) {
      return 'N/A';
    } else if (upperCaseFirstLetter) {
      return (
        status.substring(0, 1).toUpperCase() + status.substring(1).toLowerCase()
      );
    } else {
      return status.toLowerCase();
    }
  }
}
