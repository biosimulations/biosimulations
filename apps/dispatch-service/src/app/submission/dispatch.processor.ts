import { SimulationRunStatus } from '@biosimulations/datamodel/common';
import {
  DispatchJobData,
  JobQueue,
  MonitorJobData,
} from '@biosimulations/messages/messages';

import { BiosimulationsException } from '@biosimulations/shared/exceptions';
import { InjectQueue, Process, Processor } from '@biosimulations/nestjs-bullmq';
import { Logger, HttpStatus } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { HpcService } from '../services/hpc/hpc.service';
import { SimulationStatusService } from '../services/simulationStatus.service';
import { AxiosError, AxiosResponse } from 'axios';
import { Readable } from 'stream';
import { firstValueFrom, Observable } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { FormatService } from '@biosimulations/shared/services';
import { retryBackoff } from '@biosimulations/rxjs-backoff';
import { SimulationStorageService } from '@biosimulations/shared/storage';
import { SimulationRunService } from '@biosimulations/api-nest-client';

// 1 GB in bytes to be used as file size limits
const MAX_ARCHIVE_SIZE = 1e9;

@Processor(JobQueue.dispatch)
export class DispatchProcessor {
  private readonly logger = new Logger(DispatchProcessor.name);

  public constructor(
    private hpcService: HpcService,
    private simStatusService: SimulationStatusService,
    @InjectQueue(JobQueue.monitor) private monitorQueue: Queue<MonitorJobData>,
    private httpService: HttpService,
    private simulationStorageService: SimulationStorageService,
    private simulationRunService: SimulationRunService,
  ) {}

  @Process({ concurrency: 10 })
  private async handleSubmission(job: Job<DispatchJobData>): Promise<void> {
    const data = job.data;

    this.logger.debug(`Starting job for simulation run '${data.runId}' ...`);

    // resolve COMBINE archive and save to S3
    if (data.archiveUrl) {
      // resolve
      this.logger.debug(`Downloading COMBINE/OMEX archive for run '${data.runId}' from '${data.archiveUrl}' ...`);
      let file: AxiosResponse<Readable> | null = null;
      try {
        file = await firstValueFrom(
          this.httpService.get(data.archiveUrl, {
            responseType: 'stream',
            maxContentLength: MAX_ARCHIVE_SIZE,
          })
          .pipe(
            this.getRetryBackoff(),
          ),
        );
      } catch (err) {
        // if the error is bc file too bug, give this more specific error.
        // Otherwise, just let file be null, which will throw the more generic 400 below
        if ((err as AxiosError).message.includes('maxContentLength')) {
          throw new BiosimulationsException(
            HttpStatus.INTERNAL_SERVER_ERROR,
            'COMBINE/OMEX archive could not be retrieved',
            `The maximum allowed size of the file is ${FormatService.formatDigitalSize(MAX_ARCHIVE_SIZE)}. The provided file was too large.`,
            undefined,
            undefined,
            undefined,
            undefined,
            { err: err },
          );
        }
      }
      
      if (!file) {
        throw new BiosimulationsException(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'COMBINE/OMEX archive could not be retrieved',
          `The COMBINE/OMEX archive for the simulation run could not be obtained from ${data.archiveUrl}. Please check that the URL is accessible.`,
        );
      }

      let size = 0;
      const file_headers = file?.headers;
      try {
        size = Number(file_headers['content-length']);
      } catch (err) {
        size = 0;
        this.logger.warn(err);
      }

      // save to S3
      this.logger.debug(`Saving COMBINE/OMEX archive for run '${data.runId}' ...`);
      try {
        const s3file =
          await this.simulationStorageService.uploadSimulationArchive(data.runId, file.data);
        this.logger.debug(`COMBINE/OMEX archive for run '${data.runId}' was saved to '${s3file}'.`);

        const url = encodeURI(s3file);

        await this.simulationRunService.updateSimulationRunFile(data.runId, url, size).toPromise();
      } catch (err: any) {
        const details = `An error occurred saving the COMBINE/OMEX archive: ${this.getErrorMessage(
          err,
        )}.`;
        this.logger.error(details);

        const message = `An error occurred saving the COMBINE/OMEX archive${
          err instanceof Error && err.message ? ': ' + err?.message : ''
        }.`;
        throw new BiosimulationsException(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'COMBINE/OMEX archive could not be saved',
          message,
          undefined,
          undefined,
          undefined,
          undefined,
          { err: err },
        );
      }
    }

    // submit job to HPC
    this.logger.debug(
      `Submitting job for simulation run '${data.runId}' to HPC ...`,
    );
    const response = await this.hpcService.submitJob(
      data.runId,
      data.simulator,
      data.version,
      data.cpus,
      data.memory,
      data.maxTime,
      data.envVars,
      data.purpose,
      data.fileName,
    );

    if (response.stderr != '' || response.stdout === null) {
      // There was an error with submission of the job
      const message = `An error occurred in submitting an HPC job for simulation run '${data.runId}': ${response.stderr}`;
      this.logger.error(message);
      job.log(message);
      if (job.attemptsMade >= (job.opts.attempts || 0)) {
        await this.simStatusService.updateStatus(
          data.runId,
          SimulationRunStatus.FAILED,
        );
      }

      throw new BiosimulationsException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error occurred in job submission',
        message,
      );
    }

    // Get the Slurm id of the job
    // Expected output of the response is " Submitted batch job <ID> /n"
    const slurmjobId = response.stdout.trim().split(' ').slice(-1)[0];

    // Initiate monitoring of the job
    this.logger.debug(
      `Initiating monitoring for job '${slurmjobId}' for simulation run '${data.runId}' ...`,
    );

    const monitorData: MonitorJobData = {
      slurmJobId: slurmjobId.toString(),
      runId: data.runId,
      projectId: data.projectId,
      projectOwner: data.projectOwner,
      retryCount: 0,
    };
    const monitorOptions = {
      attempts: 10,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: 100,
      removeOnFail: 100,
    };

    this.monitorQueue.add('monitor', monitorData, monitorOptions);
  }

  private getRetryBackoff(): <T>(source: Observable<T>) => Observable<T> {
    return retryBackoff({
      initialInterval: 100,
      maxRetries: 10,
      resetOnSuccess: true,
      shouldRetry: (error: AxiosError): boolean => {
        const value =
          error.isAxiosError &&
          [
            HttpStatus.REQUEST_TIMEOUT,
            HttpStatus.INTERNAL_SERVER_ERROR,
            HttpStatus.BAD_GATEWAY,
            HttpStatus.GATEWAY_TIMEOUT,
            HttpStatus.SERVICE_UNAVAILABLE,
            HttpStatus.TOO_MANY_REQUESTS,
            undefined,
            null,
          ].includes(error?.response?.status);
        return value;
      },
    });
  }

  private getErrorMessage(error: any): string {
    if (error?.isAxiosError) {
      return `${error?.response?.status}: ${
        error?.response?.data?.detail || error?.response?.statusText
      }`;
    } else {
      return `${
        error?.status || error?.statusCode || error.constructor.name
      }: ${error?.message}`;
    }
  }
}
