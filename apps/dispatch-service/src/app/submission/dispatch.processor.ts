import { SimulationRunStatus } from '@biosimulations/datamodel/common';
import {
  DispatchJob,
  JobQueue,
  MonitorJob,
} from '@biosimulations/messages/messages';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { firstValueFrom } from 'rxjs';
import { HpcService } from '../services/hpc/hpc.service';
import { SimulationStatusService } from '../services/simulationStatus.service';
import { HttpService } from '@nestjs/axios';
import { AxiosError, AxiosResponse } from 'axios';
import { Readable } from 'stream';
import { SimulationStorageService } from '@biosimulations/shared/storage';
import { SimulationRunService } from '@biosimulations/api-nest-client';
import { FormatService } from '@biosimulations/shared/services';

const FILE_UPLOAD_LIMIT = 1e9; // bytes (1 GB)

@Processor(JobQueue.dispatch)
export class DispatchProcessor {
  private readonly logger = new Logger(DispatchProcessor.name);

  public constructor(
    private httpService: HttpService,
    private hpcService: HpcService,
    private simStatusService: SimulationStatusService,
    private simRunService: SimulationRunService,
    @InjectQueue(JobQueue.monitor) private monitorQueue: Queue<MonitorJob>,
    private simulationStorageService: SimulationStorageService,
  ) {}

  @Process()
  private async handleSubmission(job: Job<DispatchJob>): Promise<void> {
    const data = job.data;
    let file: Buffer | Readable;
    let fileSize: number;

    this.logger.debug(`Starting job for simulation run '${data.runId}' ...`);

    // download archive if provided as URL
    if (data.archiveType === 'url') {
      this.logger.debug(
        `Downloading archive for simulation run '${data.runId}' ...`,
      );
      const url = data.urlOrFile as string;

      let urlResponse: AxiosResponse<Readable> | null = null;
      try {
        urlResponse = await firstValueFrom(
          this.httpService.get(url, {
            responseType: 'stream',
            maxContentLength: FILE_UPLOAD_LIMIT,
          }),
        );
      } catch (err) {
        // if the error is bc file too bug, give this more specific error.
        // Otherwiise, just let file be null, which will throw the more generic 400 below
        if ((err as AxiosError).message.includes('maxContentLength')) {
          const message = `Projects (COMBINE archives) are limited to ${FormatService.formatDigitalSize(FILE_UPLOAD_LIMIT)}. The archive at ${url} is too large.`;
          this.logger.error(message);
          await this.simStatusService.updateStatus(
            data.runId,
            SimulationRunStatus.FAILED,
            message,
          );
          return;
        }
      }

      if (urlResponse) {
        let size = 0;
        const file_headers = urlResponse?.headers;
        try {
          size = Number(file_headers['content-length']);
        } catch (err) {
          size = 0;
          this.logger.warn(err);
        }
        this.logger.error(urlResponse.data.isPaused());
        file = urlResponse.data;
        fileSize = size;
      } else {
        const message = `The project (COMBINE archive) could not be obtained from ${url}. Please check that the URL is accessible.`;
        this.logger.error(message);
        await this.simStatusService.updateStatus(
          data.runId,
          SimulationRunStatus.FAILED,
          message,
        );
        return;
      }
    } else {
      file = Buffer.from(data.urlOrFile as string);
      fileSize = data.fileSize as number;
    }

    // save archive and individual files to S3 bucket
    this.logger.debug(
      `Saving archive for simulation run '${data.runId}' to S3 bucket ...`,
    );

    let fileUrl: string;

    try {
      // upload archive
      const s3file =
        await this.simulationStorageService.uploadSimulationArchive(
          data.runId,
          file,
        );
      this.logger.debug(`Uploaded simulation archive to S3: ${s3file}`);

      // upload individual files
      // - Could be merged with file post-processing
      // - File size information could be collected here
      // - Post-processing would just need to get the format of each file
      const uploadedArchiveContents =
        await this.simulationStorageService.extractSimulationArchive(
          data.runId,
        );

      this.logger.debug(
        `Uploaded archive contents: ${JSON.stringify(uploadedArchiveContents)}`,
      );

      fileUrl = encodeURI(s3file);
    } catch (err: any) {
      const details = `An error occurred in uploading the COMBINE archive for the simulation run: ${
        err?.status || err?.statusCode
      }: ${err?.message}.`;
      this.logger.error(details);

      const message = `An error occurred in uploading the COMBINE archive for the simulation run${
        err instanceof Error && err.message ? ': ' + err?.message : ''
      }.`;
      this.logger.error(message);
      await this.simStatusService.updateStatus(
        data.runId,
        SimulationRunStatus.FAILED,
        message,
      );
      return;
    }

    // update the properties of the simulation run
    this.logger.debug(
      `Updating the properties of simulation run '${data.runId}' ...`,
    );
    const error = await this.simRunService
      .updateSimulationRunProject(data.runId, fileUrl, fileSize)
      .toPromise()
      .then(() => {
        return undefined;
      })
      .catch((error: any) => {
        return error;
      });
    if (error) {
      const message = `An error occurred in updating the properties of the simulation run${
        error instanceof Error && error.message ? ': ' + error?.message : ''
      }.`;
      this.logger.error(message);
      await this.simStatusService.updateStatus(
        data.runId,
        SimulationRunStatus.FAILED,
        message,
      );
      return;
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
      await this.simStatusService.updateStatus(
        data.runId,
        SimulationRunStatus.FAILED,
        message,
      );
      return;
    }

    // Get the Slurm id of the job
    // Expected output of the response is " Submitted batch job <ID> /n"
    const slurmjobId = response.stdout.trim().split(' ').slice(-1)[0];

    // Initiate monitoring of the job
    this.logger.debug(
      `Initiating monitoring for job '${slurmjobId}' for simulation run '${data.runId}' ...`,
    );

    const monitorData: MonitorJob = {
      slurmJobId: slurmjobId.toString(),
      runId: data.runId,
      projectId: data.projectId,
      projectOwner: data.projectOwner,
      retryCount: 0,
    };

    this.monitorQueue.add(monitorData);
  }
}
