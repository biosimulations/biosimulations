import { JobQueue } from '@biosimulations/messages/messages';

import { Processor, WorkerHost, InjectQueue } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';

import { Job, Queue } from 'bullmq';

import { SshService } from '../app/services/ssh/ssh.service';

@Processor(JobQueue.refreshImages, { concurrency: 10 })
export class RefreshProcessor extends WorkerHost {
  private readonly logger = new Logger(RefreshProcessor.name);

  public constructor(
    private sshSerivce: SshService,

    @InjectQueue(JobQueue.refreshImages) private refreshQueue: Queue,
  ) {
    super();
  }

  async process(job: Job): Promise<{ stderr: string; stdout: string }> {
    const data = job.data;
    const command = data.command;
    const out = await this.sshSerivce.execStringCommand(command, 3);
    if (out.stderr) {
      this.logger.error(out.stderr);
      throw new Error(out.stderr);
    }

    return out;
  }
}
