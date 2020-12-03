import { SimulationStatus } from '../../datamodel';

export class SimulationStatusService {
  static isSimulationStatusRunning(status: SimulationStatus): boolean {
    return (
      status === SimulationStatus.queued ||
      status === SimulationStatus.started ||
      status === SimulationStatus.running
    );
  }

  static isSimulationStatusSucceeded(status: SimulationStatus): boolean {
    return status === SimulationStatus.succeeded;
  }

  static isSimulationStatusFailed(status: SimulationStatus): boolean {
    return status === SimulationStatus.failed;
  }

  static getSimulationStatusOrder(status: SimulationStatus): number {
    switch (status) {
      case SimulationStatus.succeeded:
        return 0;
      case SimulationStatus.running:
        return 1;
      case SimulationStatus.started:
        return 2;
      case SimulationStatus.queued:
        return 3;
      case SimulationStatus.failed:
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
}
