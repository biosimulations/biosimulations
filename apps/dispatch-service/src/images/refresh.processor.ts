import { JobQueue } from '@biosimulations/messages/messages';

import { Processor, Process, InjectQueue } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';

import { Job, Queue } from 'bullmq';

import { SshService } from '../app/services/ssh/ssh.service';

@Processor(JobQueue.refreshImages)
export class RefreshProcessor {
  private readonly logger = new Logger(RefreshProcessor.name);

  public constructor(
    private sshSerivce: SshService,

    @InjectQueue(JobQueue.refreshImages) private refreshQueue: Queue,
  ) {}

  @Process({ name: 'Refresh Image', concurrency: 10 })
  private async handleJobCleanup(job: Job): Promise<{ stderr: string; stdout: string }> {
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
