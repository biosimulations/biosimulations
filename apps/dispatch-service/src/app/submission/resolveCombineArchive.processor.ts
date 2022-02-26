import { SimulationRunStatus } from '@biosimulations/datamodel/common';
import {
  JobQueue,
  SubmitFileSimulationRunJobData,
  SubmitURLSimulationRunJobData,
} from '@biosimulations/messages/messages';

import { BiosimulationsException } from '@biosimulations/shared/exceptions';
import { InjectQueue, Process, Processor } from '@biosimulations/nestjs-bullmq';
import { Logger, HttpStatus } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { SimulationStatusService } from '../services/simulationStatus.service';
import { AxiosResponse, AxiosError } from 'axios';
import { Readable } from 'stream';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { FormatService } from '@biosimulations/shared/services';
import { SimulationStorageService } from '@biosimulations/shared/storage';
import { SimulationRunService } from '@biosimulations/api-nest-client';

// 1 GB in bytes to be used as file size limits
const MAX_ARCHIVE_SIZE = 1e9;

@Processor(JobQueue.resolveCombineArchive)
export class ResolveCombineArchiveProcessor {
  private readonly logger = new Logger(ResolveCombineArchiveProcessor.name);

  public constructor(
    private simStatusService: SimulationStatusService,
    @InjectQueue(JobQueue.submitSimulationRun)
    private submitQ: Queue<SubmitFileSimulationRunJobData, void>,
    private httpService: HttpService,
    private simulationStorageService: SimulationStorageService,
    private simulationRunService: SimulationRunService,
  ) {}

  @Process({ concurrency: 10 })
  private async handleSubmission(
    job: Job<SubmitURLSimulationRunJobData>,
  ): Promise<void> {
    const data = job.data;

    // resolve COMBINE/OMEX archive from URL
    this.logger.debug(
      `Downloading COMBINE/OMEX archive for run '${data.runId}' from '${data.fileUrl}' ...`,
    );
    let file!: AxiosResponse<Readable>;
    try {
      file = await firstValueFrom(
        this.httpService.get(data.fileUrl, {
          responseType: 'stream',
          maxContentLength: MAX_ARCHIVE_SIZE,
        }),
      );
    } catch (error: any) {
      // if the error is bc file too bug, give this more specific error.
      // Otherwise, just let file be null, which will throw the more generic 400 below
      let title!: string;
      let message!: string;

      if ((error as AxiosError).message.includes('maxContentLength')) {
        title = 'COMBINE/OMEX archive is too large';
        message =
          `The COMBINE/OMEX archive is too large.` +
          `The maximum allowed size of the file is ${FormatService.formatDigitalSize(
            MAX_ARCHIVE_SIZE,
          )}.`;
      } else {
        title = 'COMBINE/OMEX archive could not be retrieved';
        message = `An error occurred in resolving the COMBINE/OMEX archive for simulation run '${
          data.runId
        }': ${error?.response?.status}: ${
          error?.response?.data?.detail || error?.response?.statusText
        }`;
      }

      this.logger.error(message);
      job.log(message);

      if (
        title === 'COMBINE/OMEX archive is too large' ||
        job.attemptsMade >= (job.opts.attempts || 0)
      ) {
        await this.simStatusService.updateStatus(
          data.runId,
          SimulationRunStatus.FAILED,
        );
        job.discard();
      }

      throw new BiosimulationsException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        title,
        message,
        undefined,
        undefined,
        undefined,
        undefined,
        { err: error },
      );
    }

    let size = 0;
    const file_headers = file.headers;

    const fileName =
      file_headers['content-disposition']?.split('filename=')?.[1] ||
      'archive.omex';

    try {
      size = Number(file_headers['content-length']);
    } catch (error) {
      size = 0;
      this.logger.warn(error);
    }

    // save COMBINE/OMEX archive to S3
    this.logger.debug(
      `Saving COMBINE/OMEX archive for run '${data.runId}' ...`,
    );
    try {
      const s3file =
        await this.simulationStorageService.uploadSimulationArchive(
          data.runId,
          file.data,
          size,
        );
      this.logger.debug(
        `COMBINE/OMEX archive for run '${data.runId}' was saved to '${s3file}'.`,
      );

      const url = encodeURI(s3file);

      await this.simulationRunService
        .updateSimulationRunFile(data.runId, url, size)
        .toPromise();
    } catch (error: any) {
      const title = 'COMBINE/OMEX archive could not be saved';
      const message = `An error occurred in saving the COMBINE/OMEX archive: ${this.getErrorMessage(
        error,
      )}.`;
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
        title,
        message,
        undefined,
        undefined,
        undefined,
        undefined,
        { err: error },
      );
    }

    // submit job to dispatch queue
    const dispatchData: SubmitFileSimulationRunJobData = {
      runId: data.runId,
      fileName: fileName,
      simulator: data.simulator,
      simulatorVersion: data.simulatorVersion,
      cpus: data.cpus,
      memory: data.memory,
      maxTime: data.maxTime,
      envVars: data.envVars,
      purpose: data.purpose,
      projectId: data.projectId,
      projectOwner: data.projectOwner,
    };

    this.submitQ.add(JobQueue.submitSimulationRun, dispatchData);
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
