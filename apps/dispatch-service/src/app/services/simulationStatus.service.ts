import { SimulationRunStatus } from '@biosimulations/datamodel/common';
import { Injectable, Logger } from '@nestjs/common';
import { SimulationRunService } from '@biosimulations/api-nest-client';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SimulationStatusService {
  private logger = new Logger(SimulationStatusService.name);

  public constructor(private simService: SimulationRunService) {}

  public updateStatus(
    runId: string,
    simStatus: SimulationRunStatus,
  ): Promise<void> {
    return firstValueFrom(
      this.simService.updateSimulationRunStatus(runId, simStatus),
    )
      .then((val) =>
        this.logger.log(
          `The status of simulation run '${runId}' was successfully updated to '${simStatus}'.`,
        ),
      )
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
