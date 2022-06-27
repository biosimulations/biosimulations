import { JobQueue } from '@biosimulations/messages/messages';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QueueScheduler } from 'bullmq';

@Injectable()
export class AppQueueManagerProvider {
  public constructor(private configService: ConfigService) {
    // TODO maybe move all the queue schedulers to their own app/docker container
    // Each replica of the container will add load to redis. only one scheduler is needed across the whole deployment

    const connection = {
      host: configService.get('queue.host'),
      port: configService.get('queue.port'),
    };
    const logger = new Logger(AppQueueManagerProvider.name);
    logger.log(`Connecting to ${configService.get('queue.host')}:${configService.get('queue.port')}`);
    const refreshImagesScheduer = new QueueScheduler(JobQueue.refreshImages, { connection });
    const resolveCombineArchiveScheduler = new QueueScheduler(JobQueue.resolveCombineArchive, { connection });
    const scheduler = new QueueScheduler(JobQueue.dispatch, {
      connection,
    });

    const cleanUpQueueScheduler = new QueueScheduler(JobQueue.clean, {
      connection,
    });

    const completescheduler = new QueueScheduler(JobQueue.complete, {
      connection,
    });
    const filesscheduler = new QueueScheduler(JobQueue.files, {
      connection,
    });
    const metadatascheduler = new QueueScheduler(JobQueue.metadata, {
      connection,
    });
    const metadataPostscheduler = new QueueScheduler(JobQueue.metadataPost, {
      connection,
    });

    const logsScheduler = new QueueScheduler(JobQueue.logs, { connection });
    const logsPostScheduler = new QueueScheduler(JobQueue.logsPost, {
      connection,
    });

    const manifestsScheduler = new QueueScheduler(JobQueue.manifest, {
      connection,
    });

    const outputsScheduler = new QueueScheduler(JobQueue.output, {
      connection,
    });
    const thumbnailProcessScheduler = new QueueScheduler(JobQueue.thumbnailProcess, { connection });
    const thumbnailPostScheduler = new QueueScheduler(JobQueue.thumbnailPost, {
      connection,
    });
    const sedmlProcessScheduler = new QueueScheduler(JobQueue.sedmlProcess, {
      connection,
    });
    const sedmlPostScheduler = new QueueScheduler(JobQueue.sedmlPost, {
      connection,
    });

    const monitorScheduler = new QueueScheduler(JobQueue.monitor, {
      connection,
    });
  }
}
