import { Controller, Get, Inject, Logger } from '@nestjs/common';
import {
  ClientProxy,
  Ctx,
  EventPattern,
  JsonSocket,
  MessagePattern,
  NatsContext,
  Payload,
} from '@nestjs/microservices';
import { SimulationRunService } from '@biosimulations/dispatch/nest-client'
import { MailClientService } from '@biosimulations/mail-service/client'
import { AppService } from './app.service';
import { DispatchFinishedPayload, DispatchMessage, DispatchProcessedPayload } from '@biosimulations/messages/messages'
import { SimulationRun } from '@biosimulations/dispatch/api-models'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private emailClient: MailClientService,
    private simService: SimulationRunService,
  ) { }

  logger = new Logger(AppController.name)
  @MessagePattern(DispatchMessage.processed)
  sendEmail(@Payload() data: DispatchProcessedPayload, @Ctx() context: NatsContext) {
    this.simService.getJob(data.id).subscribe((job: SimulationRun) => {
      const email = job.email

      if (email) {

        this.emailClient.sendNotificationEmail(email, `Simulation ${data.id} completed`, "The simulation is complete", "<p>The simulation is complete<p>")
      }
    })
  }

}
