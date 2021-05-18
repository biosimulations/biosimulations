import { SimulationRunStatus } from '@biosimulations/datamodel/common';
import { SimulationRunService } from '@biosimulations/dispatch/nest-client';
import { DispatchCreatedPayload } from '@biosimulations/messages/messages';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { ArchiverService } from '../results/archiver.service';
import { LogService } from '../results/log.service';
import { ResultsService } from '../results/results.service';
import { HpcService } from '../services/hpc/hpc.service';

// TODO add typings to messages
// TODO Restore email functionality
// TODO seperate queues
// TODO define shared constants for queue names
// TODO use queue for update sim status, add error handling/retries
@Processor('dispatch')
export class SubmissionProccessor {
  private readonly logger = new Logger(SubmissionProccessor.name);
  public constructor(
    private hpcService: HpcService,
    private resultsService: ResultsService,
    private archiverService: ArchiverService,
    private simService: SimulationRunService,
    private logService: LogService,
    @InjectQueue('dispatch') private dispatchQueue: Queue,
  ) {}
  @Process('new')
  private async handleSubmission(
    job: Job<DispatchCreatedPayload>,
  ): Promise<void> {
    this.logger.debug('Starting Simulation...');
    const data = job.data;

    const response = await this.hpcService.submitJob(
      data.id,
      data.simulator,
      data.version,
      data.cpus,
      data.memory,
      data.maxTime,
      data.fileName,
    );

    if (response.stderr != '') {
      // There was an error with submission of the job
      this.logger.error(
        'Error submitting simulation:' + data.id + ' ' + response.stderr,
      );
    } else if (response.stdout != null) {
      // Get the slurm id of the job
      // TODO add the slurm id to the database for internal use only
      // Expected output of the response is " Submitted batch job <ID> /n"
      const slurmjobId = response.stdout.trim().split(' ').slice(-1)[0];
      const transpose = data.simulator == 'vcell';
      this.logger.debug(
        `Simulator is ${data.simulator} Will transpose: ${transpose}`,
      );

      const monitorData = {
        slurmJobId: slurmjobId.toString(),
        simId: data.id,
        transpose,
      };

      this.dispatchQueue.add('monitor', monitorData);
    }
  }

  @Process('monitor')
  private async handleMonitoring(job: Job): Promise<void> {
    const data = job.data;
    const slurmJobId = data.slurmJobId;
    const simId = data.simId;
    const transpose = data.transpose;
    const DELAY = 5000;
    const jobStatus: SimulationRunStatus | null = await this.hpcService.getJobStatus(
      slurmJobId,
    );
    this.logger.debug(
      `Checking status for job with id ${slurmJobId} for simulation ${simId}: Status is ${jobStatus}`,
    );

    if (jobStatus) {
      this.updateStatus(simId, jobStatus);
    }

    if (jobStatus == SimulationRunStatus.PROCESSING) {
      this.dispatchQueue.add('complete', { simId, transpose });
    } else if (jobStatus == SimulationRunStatus.FAILED) {
      this.dispatchQueue.add('failure', { simId });
    } else if (
      jobStatus == SimulationRunStatus.QUEUED ||
      jobStatus == SimulationRunStatus.RUNNING
    ) {
      this.dispatchQueue.add(
        'monitor',
        { slurmJobId, simId, transpose },
        { delay: DELAY },
      );
    } else {
      this.logger.warn(
        `${simId} skipped update, due to unknown status of ${jobStatus}`,
      );
      this.dispatchQueue.add(
        'monitor',
        { slurmJobId, simId, transpose },
        { delay: DELAY },
      );
    }
  }

  @Process('complete')
  private async handleProcessing(job: Job): Promise<void> {
    const data = job.data;

    const id = data.simId;
    const transpose = data.transpose;

    this.logger.log(`Simulation ${id} Finished. Creating logs and output`);

    const processed: PromiseSettledResult<void>[] = await Promise.allSettled([
      this.archiverService.updateResultsSize(id),
      this.resultsService.createResults(id, transpose),
      this.logService.createLog(id),
    ]);

    let completed = true;

    for (const val of processed) {
      if (val.status == 'rejected') {
        completed = false;
        this.logger.error(val.reason);
      }
    }

    if (completed) {
      this.updateStatus(id, SimulationRunStatus.SUCCEEDED).then((run) =>
        this.logger.log(`Updated Simulation ${id} to complete`),
      );
    } else {
      this.updateStatus(id, SimulationRunStatus.FAILED).then((run) =>
        this.logger.error(
          `Updated Simulation ${id} to failed due to processing error`,
        ),
      );
    }
  }

  @Process('failure')
  private async failureHandler(job: Job): Promise<void> {
    const data = job.data;
    const id = data.simId;

    this.logger.log(`Simulation ${id} Failed. Creating logs and output`);
    if (data.proccessOutput) {
      await Promise.allSettled([
        this.archiverService.updateResultsSize(id),
        this.logService.createLog(id),
      ]);
    }

    this.simService
      .updateSimulationRunStatus(id, SimulationRunStatus.FAILED)
      .subscribe((run) =>
        this.logger.log(`Updated Simulation ${run.id} to failed`),
      );
  }

  private updateStatus(
    simId: string,
    simStatus: SimulationRunStatus,
  ): Promise<void> {
    return this.simService
      .updateSimulationRunStatus(simId, simStatus)
      .toPromise()
      .then((val) => {
        this.logger.log('Successfully updated simulation');
      })
      .catch((err) => {
        this.logger.error('Failed to update status');
        this.logger.error(err);
        return;
      });
  }
}
