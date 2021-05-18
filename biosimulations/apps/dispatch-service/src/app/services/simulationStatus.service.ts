import { SimulationRunStatus } from '@biosimulations/datamodel/common';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { SimulationRunService } from '@biosimulations/dispatch/nest-client';
import { ClientProxy } from '@nestjs/microservices';
import {
  DispatchFailedPayload,
  DispatchMessage,
  DispatchProcessedPayload,
} from '@biosimulations/messages/messages';
@Injectable()
export class SimulationStatusService {
  private logger = new Logger(SimulationStatusService.name);
  public constructor(
    private simService: SimulationRunService,
    @Inject('NATS_CLIENT') private client: ClientProxy,
  ) {}
  public updateStatus(
    simId: string,
    simStatus: SimulationRunStatus,
  ): Promise<void> {
    return this.simService
      .updateSimulationRunStatus(simId, simStatus)
      .toPromise()
      .then((val) => {
        this.logger.log('Successfully updated simulation');
        if (simStatus == SimulationRunStatus.FAILED) {
          const message = new DispatchFailedPayload(simId);
          this.client.emit(DispatchMessage.failed, message);
        } else if (simStatus == SimulationRunStatus.SUCCEEDED) {
          const message = new DispatchProcessedPayload(simId);
          this.client.emit(DispatchMessage.processed, message);
        }
      })
      .catch((err) => {
        this.logger.error('Failed to update status');
        this.logger.error(err);
      });
  }
}
