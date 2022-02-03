import { SimulationRunService } from '@biosimulations/api-nest-client';
import { JobQueue, JobReturn } from '@biosimulations/messages/messages';
import { SimulationRunSedDocumentInput } from '@biosimulations/ontology/datamodel';
import { Processor, Process } from '@ejhayes/nestjs-bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { firstValueFrom } from 'rxjs';

@Processor(JobQueue.sedmlPost)
export class SedMLPostProcessor {
  private readonly logger = new Logger(SedMLPostProcessor.name);

  public constructor(private submit: SimulationRunService) {}

  @Process({ name: JobQueue.sedmlProcess, concurrency: 10 })
  private async process(job: Job): Promise<JobReturn<undefined>> {
    const data = job.data;
    const runId = data.runId;

    const children = await job.getChildrenValues();
    let sedmlSpecs: SimulationRunSedDocumentInput[] | undefined;
    try {
      sedmlSpecs = Object.keys(children)
        .filter((key) => key.includes(JobQueue.sedmlProcess))
        .map((key) => children?.[key])?.[0]?.data;
    } catch (e) {
      this.logger.error(e);
    }

    if (!sedmlSpecs) {
      return {
        status: 'Failed',
        reason: 'SED-ML specs not found',
        data: undefined,
      };
    }

    try {
      const specs = this.submit.postSpecs(runId, sedmlSpecs);

      //!!Leaving out this await will cause the job to always succeed regardless of the result of the promise
      await firstValueFrom(specs);

      return {
        status: 'Succeeded',
        reason: 'Posted sedml Specs successfully',
        data: undefined,
      };
    } catch (e) {
      this.logger.error(e);
      if (job.attemptsMade < (job.opts.attempts || 0)) {
        throw e;
      }
      return {
        status: 'Failed',
        reason: 'Failed to post SED-ML specs',
        data: undefined,
      };
    }
  }
}
