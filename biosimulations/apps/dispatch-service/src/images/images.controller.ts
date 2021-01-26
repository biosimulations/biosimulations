import {
  ImageMessage,
  ImageMessagePayload,
  ImageMessageResponse,
} from '@biosimulations/messages/messages';
import { Controller, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MessagePattern } from '@nestjs/microservices';
import { SbatchService } from '../app/services/sbatch/sbatch.service';
import { SshService } from '../app/services/ssh/ssh.service';

@Controller()
export class ImagesController {
  constructor(
    private sshSerivce: SshService,
    private configService: ConfigService,
    private sbatchService: SbatchService,
  ) {}
  logger = new Logger(ImagesController.name);

  @MessagePattern(ImageMessage.refresh)
  async refreshImage(data: ImageMessagePayload) {
    const url = data.url;
    const homeDir = this.configService.get('hpc.homeDir');
    const force = data.force ? '--force' : '';
    this.logger.log('sending command to update' + data.url);
    const sbatch = this.sbatchService.generateImageUpdateSbatch(url, force);
    const command = `echo "${sbatch}" > updateImage.sbatch && chmod +x updateImage.sbatch && sbatch updateImage.sbatch`;
    const out = await this.sshSerivce.execStringCommand(command);

    if (out.stderr != '') {
      return new ImageMessageResponse(false, out.stderr);
    } else {
      return new ImageMessageResponse(true, out.stdout);
    }
  }
}
