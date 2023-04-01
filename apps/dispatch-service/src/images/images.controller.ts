import { ImageMessage, ImageMessagePayload, ImageMessageResponse, JobQueue } from '@biosimulations/messages/messages';
import { InjectQueue } from '@nestjs/bullmq';
import { Controller, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MessagePattern } from '@nestjs/microservices';
import { Queue } from 'bullmq';
import { SbatchService } from '../app/services/sbatch/sbatch.service';
import { SshService } from '../app/services/ssh/ssh.service';

@Controller()
export class ImagesController {
  constructor(
    private sshSerivce: SshService,
    private configService: ConfigService,
    private sbatchService: SbatchService,
    @InjectQueue(JobQueue.refreshImages) private refreshQueue: Queue,
  ) {}
  logger = new Logger(ImagesController.name);

  @MessagePattern(ImageMessage.refresh)
  public async refreshImage(data: ImageMessagePayload): Promise<ImageMessageResponse> {
    const url = data.url;
    const force = data.force;
    this.logger.log('Sending command to update ' + url);
    const sbatchString = this.sbatchService.generateImageUpdateSbatch(data.simulator, data.version, url, force);
    const refreshImagesDir = this.configService.get('hpc.refreshImagesDir');
    const sbatchFilename = `${refreshImagesDir}/${data.simulator}/${data.version}.sbatch`;
    const command = [
      `mkdir -p "${refreshImagesDir}/${data.simulator.replace('"', '\\"')}"`,
      `{ cat > "${sbatchFilename.replace('"', '\\"')}" << 'EOF'\n${sbatchString}\nEOF\n}`,
      `chmod +x "${sbatchFilename.replace('"', '\\"')}"`,
      `sbatch "${sbatchFilename.replace('"', '\\"')}"`,
    ].join(' && ');

    const job = await this.refreshQueue.add(
      'Refresh Image',
      {
        command,
      },
      {
        attempts: 10,
        removeOnComplete: false,
        removeOnFail: false,
      },
    );

    return new ImageMessageResponse(true, job.id);
  }
}
