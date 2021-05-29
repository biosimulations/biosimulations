import { SimulationRunStatus } from '@biosimulations/datamodel/common';

export class SimulationStatusService {
  public static isSimulationStatusRunning(
    status: SimulationRunStatus,
  ): boolean {
    return (
      status === SimulationRunStatus.CREATED ||
      status === SimulationRunStatus.QUEUED ||
      status === SimulationRunStatus.RUNNING ||
      status === SimulationRunStatus.PROCESSING
    );
  }

  public static isSimulationStatusSucceeded(
    status: SimulationRunStatus,
  ): boolean {
    return status === SimulationRunStatus.SUCCEEDED;
  }

  public static isSimulationStatusFailed(status: SimulationRunStatus): boolean {
    return status === SimulationRunStatus.FAILED;
  }

  public static getSimulationStatusOrder(status: SimulationRunStatus): number {
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
    }
    return NaN;
  }

  public static getSimulationStatusMessage(
    status: SimulationRunStatus,
    upperCaseFirstLetter = false,
  ): string {
    if (upperCaseFirstLetter) {
      return (
        status.substring(0, 1).toUpperCase() + status.substring(1).toLowerCase()
      );
    } else {
      return status.toLowerCase();
    }
  }

  public static formatTime(
    nullFormattedValue: string | null,
    valueSec: number | null | undefined,
  ): string | null {
    if (valueSec == null || valueSec === undefined) {
      return nullFormattedValue;
    }

    if (valueSec > 7 * 24 * 60 * 60) {
      return (valueSec / (7 * 24 * 60 * 60)).toFixed(1) + ' w';
    } else if (valueSec > 24 * 60 * 60) {
      return (valueSec / (24 * 60 * 60)).toFixed(1) + ' d';
    } else if (valueSec > 60 * 60) {
      return (valueSec / (60 * 60)).toFixed(1) + ' h';
    } else if (valueSec > 60) {
      return (valueSec / 60).toFixed(1) + ' m';
    } else if (valueSec > 1) {
      return valueSec.toFixed(1) + ' s';
    } else {
      return (valueSec * 1000).toFixed(1) + ' ms';
    }
  }
}
