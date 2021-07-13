import { permissions } from '@biosimulations/auth/nest';
import {
  ImageMessage,
  ImageMessagePayload,
  ImageMessageResponse,
} from '@biosimulations/messages/messages';
import {
  Body,
  Controller,
  Inject,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { refreshImageBody } from './image.dto';

@Controller('images')
@ApiTags('Internal management')
export class ImagesController {
  constructor(@Inject('NATS_CLIENT') private client: ClientProxy) {}
  @ApiOperation({
    summary: 'Refresh Container Image',
    description:
      'Trigger a rebuild of the Singularity image of a particular container',
  })
  @ApiBody({ type: refreshImageBody })
  @permissions('refresh:Images')
  @Post('refresh')
  async refreshImage(@Body() data: refreshImageBody) {
    const message = new ImageMessagePayload(data.simulator, data.version);
    // !Replace with wrapper to allow typing
    const success = await this.client
      .send<ImageMessageResponse>(ImageMessage.refresh, message)
      .toPromise();
    if (success?.okay) {
      return success.description;
    } else {
      throw new InternalServerErrorException(success?.description);
    }
  }
}
