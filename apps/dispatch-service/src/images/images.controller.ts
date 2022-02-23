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
    const force = data.force;
    this.logger.log('Sending command to update ' + url);
    const sbatchString = this.sbatchService.generateImageUpdateSbatch(
      data.simulator,
      data.version,
      url,
      force,
    );
    const refreshImagesDir = this.configService.get('hpc.refreshImagesDir');
    const sbatchFilename = `${refreshImagesDir}/${data.simulator}/${data.version}.sbatch`;
    const command = [
      `mkdir -p "${refreshImagesDir}/${data.simulator.replace('"', '\\"')}"`,
      `{ cat > "${sbatchFilename.replace(
        '"',
        '\\"',
      )}" << 'EOF'\n${sbatchString}\nEOF\n}`,
      `chmod +x "${sbatchFilename.replace('"', '\\"')}"`,
      `sbatch "${sbatchFilename.replace('"', '\\"')}"`,
    ].join(' && ');
    const out = await this.sshSerivce.execStringCommand(command);

    if (out.stderr != '') {
      return new ImageMessageResponse(false, out.stderr);
    } else {
      return new ImageMessageResponse(true, out.stdout);
    }
  }
}
