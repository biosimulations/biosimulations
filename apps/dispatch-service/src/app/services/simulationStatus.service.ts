import { SimulationRunStatus } from '@biosimulations/datamodel/common';
import { Injectable, Logger } from '@nestjs/common';
import { SimulationRunService } from '@biosimulations/dispatch/nest-client';

@Injectable()
export class SimulationStatusService {
  private logger = new Logger(SimulationStatusService.name);
  public constructor(private simService: SimulationRunService) {}
  public updateStatus(
    simId: string,
    simStatus: SimulationRunStatus,
    reason: string,
  ): Promise<void> {
    return this.simService
      .updateSimulationRunStatus(simId, simStatus, reason)
      .toPromise()
      .then((val) => {
        this.logger.log('Successfully updated simulation');
      })
      .catch((err) => {
        this.logger.error('Failed to update status');
        this.logger.error(err);
      });
  }
}
