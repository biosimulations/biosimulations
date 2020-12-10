/**
 * @file Provides listeners to the messaging system for submitting jobs. Will listen for a DispatchMessage.created to start a simulation, then monitor and update the staus.
 * Will emit messages as needed to reflect changes to the simulation.
 * @author Bilal Shaikh
 * @copyright Biosimulations Team, 2020
 * @license MIT
 */
import { urls } from '@biosimulations/config/common';
import { SimulationRunStatus } from '@biosimulations/dispatch/api-models';
import {
  DispatchMessage,
  DispatchCreatedPayload,
  createdResponse,
  MQDispatch,
  DispatchSubmittedPayload,
  DispatchPayload,
} from '@biosimulations/messages/messages';
import { Controller, HttpService, Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { stat } from 'fs';
import { AppService } from './app.service';
import { ModelsService } from './resources/models/models.service';
import { ArchiverService } from './services/archiver/archiver.service';
import { HpcService } from './services/hpc/hpc.service';
import { SbatchService } from './services/sbatch/sbatch.service';

@Controller()
export class SubmissionController {
  constructor(
    private appService: AppService,
    private schedulerRegistry: SchedulerRegistry,
    private readonly configService: ConfigService,
    private hpcService: HpcService,
    private http: HttpService,
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
      // The job submissions worked

      //Create and emit message
      const message: DispatchSubmittedPayload = {
        _message: DispatchMessage.submitted,
        id: data.id,
      };
      this.messageClient
        .emit(DispatchMessage.submitted, message)
        .subscribe(() => {});

      // Get the slurm id of the job
      // Expected output of the response is " Submitted batch job <ID> /n"
      const slurmjobId = response.stdout.trim().split(' ').slice(-1)[0];

      this.startMonitoringCronJob(slurmjobId.toString(), data.id, 5);
    }

    return new createdResponse();
  }

  async startMonitoringCronJob(jobId: string, simId: string, seconds: number) {
    this.logger.log(
      `Starting to monitor job with id ${jobId} for simulation ${simId}`
    );

    const job = new CronJob(`*/${seconds.toString()} * * * * *`, async () => {
      const jobStatus: SimulationRunStatus = await this.hpcService.getJobStatus(
        jobId
      );

      this.logger.log(`SLURM status for job ${jobId}: ${jobStatus}`);

      switch (jobStatus) {
        case SimulationRunStatus.QUEUED: {
          const message: DispatchPayload = {
            _message: DispatchMessage.queued,
            id: simId,
          };
          this.messageClient.emit(DispatchMessage.queued, message);
          this.updateSimulationRunStatus(simId, jobStatus);

          break;
        }

        case SimulationRunStatus.RUNNING: {
          const runningMessage: DispatchPayload = {
            _message: DispatchMessage.started,
            id: simId,
          };
          this.messageClient.emit(DispatchMessage.started, runningMessage);
          this.appService.updateSimulationInDb(simId, { status: jobStatus });
          break;
        }

        case SimulationRunStatus.SUCCEEDED: {
          // TODO Remove this message when implmentation is finished
          this.messageClient.emit(MQDispatch.SIM_HPC_FINISH, simId);

          this.updateSimulationRunStatus(simId, jobStatus);
          const succeededMessage: DispatchPayload = {
            _message: DispatchMessage.started,
            id: simId,
          };
          this.messageClient.emit(DispatchMessage.finsihed, succeededMessage);
          this.schedulerRegistry.getCronJob(jobId).stop();

          break;
        }
        case SimulationRunStatus.FAILED: {
          this.logger.error(`Job with id ${jobId} failed`);
          const update = this.updateSimulationRunStatus(
            simId,
            SimulationRunStatus.FAILED
          );

          const failedMessage: DispatchPayload = {
            _message: DispatchMessage.started,
            id: simId,
          };
          this.messageClient.emit(DispatchMessage.failed, failedMessage);
          this.schedulerRegistry.getCronJob(jobId).stop();

          break;
        }
        case SimulationRunStatus.CANCELLED: {
          this.appService.updateSimulationInDb(simId, {
            status: jobStatus,
          });
          this.schedulerRegistry.getCronJob(jobId).stop();

          break;
        }
      }
    });

    this.schedulerRegistry.addCronJob(jobId, job);
    job.start();
  }

  async updateSimulationRunStatus(id: string, status: SimulationRunStatus) {
    const token = await this.appService.getAuthTokenForAPI();
    this.http
      .patch(
        `${urls.dispatchApi}run/${id}`,
        { status: status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .toPromise();
  }
}
