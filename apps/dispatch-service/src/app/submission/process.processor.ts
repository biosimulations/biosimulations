import { JobQueue } from '@biosimulations/messages/messages';
import { Processor, WorkerHost, InjectQueue } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FlowProducer, Job, Queue } from 'bullmq';

@Processor(JobQueue.process, { concurrency: 1 })
export class ProcessProcessor extends WorkerHost {
  private readonly logger = new Logger(ProcessProcessor.name);

  private flowProducer: FlowProducer;
  public constructor(
    @InjectQueue(JobQueue.manifest) private manifestQueue: Queue,
    @InjectQueue(JobQueue.files) private filesQueue: Queue,
    @InjectQueue(JobQueue.thumbnailProcess)
    private thumbnailsQueue: Queue,
    private configService: ConfigService,
  ) {
    super();
    const queuehost = this.configService.get('queue.host');
    const queueport = this.configService.get('queue.port');
    this.flowProducer = new FlowProducer({
      connection: { host: queuehost, port: queueport },
    });
  }

  public async process(job: Job): Promise<void> {
    // Called as soon as simulation is complete.
    this.logger.log(`Processing job ${job.id}`);
    const runId = job.data.runId;
    // Each job defined below should be as close to atomic as possible to enable retries.

    // 1. Get manifest from COMBINE API
    const manifestJob = {
      name: 'Manifest',
      queueName: JobQueue.manifest,
      opts: {
        jobId: `${runId}`,
        attempts: 5,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
      data: {
        runId: job.data.runId,
        description: 'Process the manifest file in the COMBINE archive',
        moreInfo: 'https://combinearchive.org',
        validator: 'https://run.biosimulations.org/utils/validate-project',
        errorMessage: 'The manifest for the COMBINE archive could not be processed.',
        internalError: true,
        required: true,
      },
    };

    // Process the manifest and post the manifest to the API
    const filesJob = {
      name: 'Files',
      queueName: JobQueue.files,
      data: {
        runId: job.data.runId,
        description: 'Read the manifest and post the files to the API',
        moreInfo: undefined,
        validator: undefined,
        errorMessage: `There was an error uploading file metadata to the API. Please try again and contact us if the problem persists.`,
        required: true,
        internalError: true,
      },
      opts: {
        jobId: `${runId}`,
      },
      // Needs extraction completed (part of SBatch job) and manifest completed
      children: [manifestJob],
    };

    const thumbnailsProcessJob = {
      name: 'Create thumbnails',
      queueName: JobQueue.thumbnailProcess,
      data: {
        runId: job.data.runId,
        description: 'Create thumbnails from the images specified in the manifest',
        moreInfo: undefined,
        validator: 'https://run.biosimulations.org/utils/validate-project',
        errorMessage: `There was an error creating thumbnails for the project. Please ensure that the images specified in the manifest are valid.`,
        required: false,
        internalError: false,
      },
      opts: {
        jobId: `${runId}`,
        maxStalledCount: 3,
        attempts: 5,
        lockDuration: 120000, // wait up to 2 minutes before marking job as stalled
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
      // Needs file processing completed
      children: [filesJob],
    };

    const postThumbnailsJob = {
      name: 'Post thumbnails',
      queueName: JobQueue.thumbnailPost,
      data: {
        runId: job.data.runId,
        description: 'Post thumbnails to the API',
        moreInfo: undefined,
        validator: undefined,
        errorMessage: `There was an error uploading thumbnails to the API. Please try again and contact us if the problem persists.`,
        required: false,
        internalError: true,
      },
      opts: {
        jobId: `${runId}`,
      },
      children: [thumbnailsProcessJob],
    };

    const sedmljob = {
      name: 'SED-ML',
      queueName: JobQueue.sedmlProcess,
      data: {
        runId: job.data.runId,
        description: 'Process the SED-ML file in the COMBINE archive',
        moreInfo: 'https://docs.biosimulations.org/concepts/conventions/simulation-experiments/',
        validator: 'https://run.biosimulations.org/utils/validate-simulation',
        errorMessage: 'There was an error in processing the simulation experiments in the SED-ML file.',
        required: true,
        internalError: false,
      },
      opts: {
        jobId: `${runId}`,
        attempts: 5,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
    };
    const postSedmlJob = {
      name: 'Post SED-ML',
      queueName: JobQueue.sedmlPost,
      data: {
        runId: job.data.runId,
        description: 'Post the SED-ML file to the API',
        moreInfo: job.data.moreInfo,
        reason: job.failedReason,
        validator: undefined,
        errorMessage: `There was an error uploading the SED-ML specifications to the API.`,
        required: true,
        internalError: true,
      },
      opts: {
        jobId: `${runId}`,
        attempts: 5,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
      children: [sedmljob],
    };

    const outputsJob = {
      name: 'Output',
      queueName: JobQueue.output,
      data: {
        runId: job.data.runId,
        description: 'Process and upload the outputs of the simulation run',
        moreInfo: undefined,
        validator: undefined,
        errorMessage: `There was an error uploading the outputs to the API.`,
        required: true,
        internalError: true,
      },
      opts: {
        jobId: `${runId}`,
        attempts: 5,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
    };

    const logsJob = {
      name: 'Logs',
      queueName: JobQueue.logs,
      data: {
        runId: job.data.runId,
        description: 'Retrieve the logs of the simulation run',
        moreInfo: 'https://docs.biosimulations.org/concepts/conventions/simulation-run-logs/',
        validator: 'https://api.biosimulations.org',
        errorMessage: 'There was an error retrieving the logs of the simulation run.',
        required: true,
        internalError: true,
      },
      opts: {
        jobId: `${runId}`,
        attempts: 3,
        lockDuration: 60000, // wait up to 1 minutes before marking job as stalled
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
    };
    const postLogsJob = {
      name: 'Post logs',
      queueName: JobQueue.logsPost,
      data: {
        runId: job.data.runId,
        description: 'Post the logs to the API',
        moreInfo: undefined,
        validator: undefined,
        errorMessage: `There was an error uploading the logs to the API.`,
        internalError: true,
        required: true,
      },
      opts: {
        jobId: `${runId}`,
        attempts: 5,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
      children: [logsJob],
    };

    const metadataJob = {
      name: 'Metadata',
      queueName: JobQueue.metadata,
      data: {
        runId: job.data.runId,
        description: `Process the metadata in the COMBINE archive`,
        moreInfo: 'https://docs.biosimulations.org/concepts/conventions/simulation-project-metadata/',
        validator: 'https://run.biosimulations.org/utils/validate-metadata',
        errorMessage: 'There was an error in processing the metadata file.',
        required: false,
        internalError: false,
      },
    };

    const postMetadataJob = {
      name: 'Post Metadata',
      queueName: JobQueue.metadataPost,
      data: {
        runId: job.data.runId,
        description: 'Post the metadata to the API',
        moreInfo: undefined,
        validator: undefined,
        errorMessage: `There was an error uploading the metadata to the API.`,
        required: false,
        internalError: true,
      },
      opts: {
        jobId: `${runId}`,
        attempts: 5,
        maxStalledCount: 3,
        lockDuration: 1000,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
      children: [metadataJob],
    };

    const flow = await this.flowProducer.add({
      name: 'complete', // Final completion of the job
      queueName: JobQueue.complete, // add to the complete queue
      data: {
        runId: job.data.runId,
        status: job.data.status,
        projectId: job.data.projectId,
        projectOwner: job.data.projectOwner,
      },
      opts: {
        jobId: `${runId}`,
      },
      // Needs all the different steps completed before it can be completed
      children: [postThumbnailsJob, postSedmlJob, outputsJob, postLogsJob, postMetadataJob],
    });
  }
}
