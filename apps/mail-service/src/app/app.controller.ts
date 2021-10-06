import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SimulationRunService } from '@biosimulations/dispatch/nest-client';
import { MailClientService } from '@biosimulations/mail-service/client';
import { AppService } from './app.service';
import {
  DispatchMessage,
  DispatchProcessedPayload,
} from '@biosimulations/messages/messages';
import { SimulationRun } from '@biosimulations/datamodel/api';
import { firstValueFrom } from 'rxjs';

@Controller()
export class AppController {
  private logger = new Logger(AppController.name);

  public constructor(
    private readonly appService: AppService,
    private emailClient: MailClientService,
    private simService: SimulationRunService,
  ) {}

  @MessagePattern(DispatchMessage.processed)
  private sendEmail(@Payload() data: DispatchProcessedPayload): void {
    firstValueFrom(this.simService.getJob(data.id)).then(
      (job: SimulationRun) => {
        const email = job.email;
        //const status = job.status  use the status to determine which email to send?
        if (email) {
          this.emailClient.sendSuccessEmail(
            email,
            job.id,
            job.name,
            new Date(job.submitted),
          );
        }
      },
    );
  }

  @MessagePattern(DispatchMessage.failed)
  private sendFailedEmail(@Payload() data: DispatchProcessedPayload): void {
    firstValueFrom(this.simService.getJob(data.id)).then(
      (job: SimulationRun) => {
        const email = job.email;
        //const status = job.status  use the status to determine which email to send?
        if (email) {
          this.emailClient.sendFailureEmail(
            email,
            job.id,
            job.name,
            new Date(job.submitted),
          );
        }
      },
    );
  }
}
