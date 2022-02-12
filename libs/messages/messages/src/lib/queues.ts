/* eslint-disable @typescript-eslint/explicit-member-accessibility */

import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import {
  EnvironmentVariable,
  Purpose,
  SimulationRunStatus,
} from '@biosimulations/datamodel/common';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const BullModuleOptions = {
  imports: [BiosimulationsConfigModule],
  useFactory: async (configService: ConfigService) => {
    const logger = new Logger('BullModuleInit');
    logger.log(
      `Connecting to ${configService.get('queue.host')}:${configService.get(
        'queue.port',
      )}`,
    );
    return {
      connection: {
        host: configService.get('queue.host'),
        port: configService.get('queue.port'),
      },
    };
  },
  inject: [ConfigService],
};
export enum JobQueue {
  dispatch = 'dispatch', //submit a job to hpc
  monitor = 'monitor', // monitor the hpc job
  process = 'process', // Top level job when simulation run is complete
  extract = 'extract', // extract the combine archive
  manifest = 'manifest', // create the manifest
  files = 'files', // process and post manifest to API
  thumbnailProcess = 'thumbnailProcess', // create thumbnails
  thumbnailPost = 'thumbnailPost', // post thumbnails to API
  output = 'output', // upload output archive and size
  sedmlProcess = 'sedmlProcess', // process sedml from combine api
  sedmlPost = 'sedmlPost', // post sedml to API
  logs = 'logs', // get the output log and std log
  logsPost = 'logsPost', // post the output log and std log to API
  metadata = 'metadata', // get the metadata from combine api
  metadataPost = 'metadataPost', // post the metadata to API
  complete = 'complete', // gather all the work, submit final status and logs
  publish = 'publish', // publish the simulation run as a project
  clean = 'clean', // clean up the queues
  health = 'health', // health check
}

export enum JobStatus {
  failed = 'Failed',
  succeeded = 'Succeeded',
}
export class JobReturn<T> {
  status!: 'Failed' | 'Succeeded';
  reason!: string;
  data!: T;
}

// TODO project owner should just be a property of the SimulationRun model and not sent in message
export class MonitorJobData {
  slurmJobId!: string;
  runId!: string;
  projectId?: string;
  projectOwner?: string;
  retryCount!: number;
}

export class DispatchJobData {
  runId!: string;
  fileName!: string;
  archiveUrl?: string;
  simulator!: string;
  version!: string;  
  cpus!: number;
  memory!: number;
  maxTime!: number;
  envVars!: EnvironmentVariable[];
  purpose!: Purpose;
  projectId?: string;
  projectOwner?: string;
}

export class CompleteJobData {
  runId!: string;
  status!: SimulationRunStatus;
  projectId?: string;
  projectOwner?: string;
}

export class PublishJobData {
  runId!: string;
  projectId?: string;
  projectOwner?: string;
  finalStatus!: SimulationRunStatus;
}

export class ManifestJobData {
  runId!: string;
}
