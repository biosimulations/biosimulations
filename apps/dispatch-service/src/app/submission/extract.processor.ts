import { JobQueue, JobReturn } from '@biosimulations/messages/messages';
import { SimulationStorageService } from '@biosimulations/shared/storage';

import { Processor, Process } from '@biosimulations/nestjs-bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@Processor(JobQueue.extract)
export class ExtractProcessor {
  private readonly logger = new Logger(ExtractProcessor.name);

  public constructor(
    private simulationStorageService: SimulationStorageService,
  ) {}

  @Process({ name: 'extract', concurrency: 10 })
  private async handleFileExtraction(job: Job): Promise<JobReturn<string[]>> {
    const data = job.data;
    const runId = data.runId;

    let message = 'Beginning extraction of archive for simulation';
    job.log(message);
    this.logger.debug(message);

    try {
      const extractedFiles =
        await this.simulationStorageService.extractSimulationArchive(runId);
      message = `Extracted simulation archive for simulation run '${runId}'`;
      this.logger.debug(message);
      job.log(message);
      job.updateProgress(100);
      return {
        status: 'Succeeded',
        data: extractedFiles,
        reason: 'Extracted archive successfully',
      };
    } catch (error) {
      message = `Failed to extract simulation archive for simulation run '${runId}'`;
      this.logger.error(message, error);

      if (job.attemptsMade < (job.opts?.attempts || 0)) {
        throw error;
      }

      job.log('Retries exhausted');
      job.log(message);

      return {
        status: 'Failed',
        reason: message,
        data: [],
      };
    }
  }
}
