import { SimulationStatus } from '../../datamodel';

export class SimulationStatusService {
  static isSimulationStatusRunning(status: SimulationStatus): boolean {
    return (
      status === SimulationStatus.CREATED ||
      status === SimulationStatus.QUEUED ||
      status === SimulationStatus.RUNNING
    );
  }

  static isSimulationStatusSucceeded(status: SimulationStatus): boolean {
    return status === SimulationStatus.SUCCEEDED;
  }

  static isSimulationStatusFailed(status: SimulationStatus): boolean {
    return status === SimulationStatus.FAILED;
  }

  static getSimulationStatusOrder(status: SimulationStatus): number {
    switch (status) {
      case SimulationStatus.SUCCEEDED:
        return 0;
      case SimulationStatus.RUNNING:
        return 1;
      case SimulationStatus.QUEUED:
        return 2;
      case SimulationStatus.CREATED:
        return 3;
      case SimulationStatus.FAILED:
        return 4;
    }
    return NaN;
  }

  static getSimulationStatusMessage(
    status: SimulationStatus,
    upperCaseFirstLetter = false
  ): string {
    if (upperCaseFirstLetter) {
      return (
        status.substring(0, 1).toUpperCase() + status.substring(1).toLowerCase()
      );
    } else {
      return status.toLowerCase();
    }
  }

  static formatTime(nullFormattedValue: string | null, valueSec: number | null | undefined): string | null {
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
