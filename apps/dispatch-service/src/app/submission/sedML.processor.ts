import { JobQueue, JobReturn } from '@biosimulations/messages/messages';
import { SimulationRunSedDocumentInput } from '@biosimulations/ontology/datamodel';
import { Processor, Process } from '@biosimulations/nestjs-bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { firstValueFrom } from 'rxjs';
import { SedmlService } from '../../sedml/sedml.service';

@Processor(JobQueue.sedmlProcess)
export class SedMLProcessor {
  private readonly logger = new Logger(SedMLProcessor.name);

  public constructor(private sedmlService: SedmlService) {}

  @Process({ name: JobQueue.sedmlProcess, concurrency: 10 })
  private async process(
    job: Job,
  ): Promise<JobReturn<SimulationRunSedDocumentInput[]>> {
    const data = job.data;
    const runId = data.runId;
    try {
      const sedMlProcessingResults = await firstValueFrom(
        this.sedmlService.processSedml(runId),
      );
      return {
        status: 'Succeeded',
        data: sedMlProcessingResults,
        reason: 'Processed and saved SedML Successfully',
      };
    } catch (e) {
      if (job.attemptsMade < (job.opts.attempts || 0)) {
        this.logger.warn('SedML processing failed, retrying');
        throw e;
      } else {
        const message = `The SedML could not be created for runId ${runId}`;
        this.logger.error(message);
        job.log(message);
        const details = (e as Error).message;
        job.log(details);
        return {
          status: 'Failed',
          reason: 'The SedML could not be retrieved from the combine API',
          data: [],
        };
      }
    }
  }
}
