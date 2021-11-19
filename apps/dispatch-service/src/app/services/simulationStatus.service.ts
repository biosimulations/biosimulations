import { SimulationRunStatus } from '@biosimulations/datamodel/common';
import { Injectable, Logger } from '@nestjs/common';
import { SimulationRunService } from '@biosimulations/api-nest-client';

@Injectable()
export class SimulationStatusService {
  private logger = new Logger(SimulationStatusService.name);

  public constructor(private simService: SimulationRunService) {}

  public updateStatus(
    runId: string,
    simStatus: SimulationRunStatus,
    reason: string,
  ): Promise<void> {
    return this.simService
      .updateSimulationRunStatus(runId, simStatus, reason)
      .toPromise()
      .then((val) => {
        this.logger.log(
          `The status of simulation run '${runId}' was successfully updated to '${simStatus}'.`,
        );
      })
      .catch((error) => {
        this.logger.error(
          `The status of simulation run '${runId}' could not be updated to '${simStatus}': ${error}`,
        );
        if (
          simStatus === SimulationRunStatus.SUCCEEDED ||
          simStatus === SimulationRunStatus.FAILED
        ) {
          throw error;
        }
      });
  }
}
