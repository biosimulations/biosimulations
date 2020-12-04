/**
 * @file Provides listeners to the messaging system for submitting jobs. Will listen for a DispatchMessage.created to start a simulation, then monitor and update the staus.
 * Will emit messages as needed to reflect changes to the simulation.
 * @author Bilal Shaikh
 * @copyright Biosimulations Team, 2020
 * @license MIT
 */
import {
  DispatchMessage,
  DispatchCreatedPayload,
  createdResponse,
  MQDispatch,
} from '@biosimulations/messages/messages';
import { Controller, Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ModelsService } from './resources/models/models.service';
import { ArchiverService } from './services/archiver/archiver.service';
import { HpcService } from './services/hpc/hpc.service';
import { SbatchService } from './services/sbatch/sbatch.service';
import { SimulationService } from './services/simulation/simulation.service';

@Controller()
export class SubmissionController {
  constructor(
    private readonly configService: ConfigService,
    private hpcService: HpcService,
    @Inject('DISPATCH_MQ') private messageClient: ClientProxy
  ) {}
  private logger = new Logger(SubmissionController.name);
  private fileStorage: string = this.configService.get<string>(
    'hpc.fileStorage',
    ''
  );

  /**
   *The method responds to the message by calling the hpc service to start a job. It then sends a reply to the message.
   *
   * @param data The payload sent for the created simulation run message
   */
  @MessagePattern(DispatchMessage.created)
  async uploadFile(data: DispatchCreatedPayload): Promise<createdResponse> {
    this.logger.log('Starting to dispatch simulation');
    this.logger.log('Data received: ' + JSON.stringify(data));

    // TODO have this send back a status and adjust response accordingly
    const response = await this.hpcService.submitJob(
      data.id,
      data.simulator,
      data.version,
      data.fileName
    );
    this.messageClient.emit(DispatchMessage.submitted, response);

    // TODO Replace this call with only the one below
    this.messageClient
      .send(MQDispatch.SIM_DISPATCH_FINISH, { simId: data.id, ...response })
      .subscribe(() => {
        // Do something when execution of message method is done
      });

    return new createdResponse();
  }
}
