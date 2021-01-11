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
  DispatchSubmittedPayload,
} from '@biosimulations/messages/messages';
import { Controller, Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';

import { HpcService } from '../services/hpc/hpc.service';
import { SubmissionService } from './submission.service';

@Controller()
export class SubmissionController {
  constructor(
    private service: SubmissionService,
    private readonly configService: ConfigService,
    private hpcService: HpcService,
    @Inject('NATS_CLIENT') private messageClient: ClientProxy
  ) { }
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

    this.logger.log('Starting Submission:' + JSON.stringify(data));

    const response = await this.hpcService.submitJob(
      data.id,
      data.simulator,
      data.version,
      data.fileName
    );
    if (response.stderr != '') {
      // There was an error with submission of the job
      this.logger.error(response.stderr);
      return new createdResponse(false, response.stderr);
    } else if (response.stdout != null) {
      //Create and emit message
      const message: DispatchSubmittedPayload = {
        _message: DispatchMessage.submitted,
        id: data.id,
      };
      this.messageClient
        .emit(DispatchMessage.submitted, message)
        .subscribe(() => { });

      // Get the slurm id of the job
      // TODO add the slurm id to the database for internal use only 
      // Expected output of the response is " Submitted batch job <ID> /n"
      const slurmjobId = response.stdout.trim().split(' ').slice(-1)[0];
      const transpose =
        data.simulator == 'vcell';
      this.logger.debug(
        `Simulator is ${data.simulator} Will transpose: ${transpose}`
      );

      this.service.startMonitoringCronJob(
        slurmjobId.toString(),
        data.id,
        5,
        transpose
      );
    }

    return new createdResponse();
  }
}
