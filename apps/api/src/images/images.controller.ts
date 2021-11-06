import { permissions } from '@biosimulations/auth/nest';
import {
  ImageMessage,
  ImageMessagePayload,
  ImageMessageResponse,
} from '@biosimulations/messages/messages';
import {
  Body,
  Controller,
  HttpCode,
  Inject,
  InternalServerErrorException,
  Post,
  HttpStatus,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiBody,
  ApiOperation,
  ApiTags,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiPayloadTooLargeResponse,
} from '@nestjs/swagger';
import { refreshImageBody } from './image.dto';
import { ErrorResponseDocument } from '@biosimulations/datamodel/api';
import { scopes } from '@biosimulations/config/common';

@Controller('images')
@ApiTags('Internal')
export class ImagesController {
  public constructor(@Inject('NATS_CLIENT') private client: ClientProxy) {}

  @ApiOperation({
    summary:
      'Trigger the building a Singularity image for a version of a simulation tool',
    description:
      'Trigger the simulation service to build (or rebuild) a Singularity image for a version of a simulation tool',
  })
  @ApiBody({
    description:
      'Version of a simulation tool to build (or rebuild) a Singularity image for',
    type: refreshImageBody,
  })
  @ApiPayloadTooLargeResponse({
    type: ErrorResponseDocument,
    description:
      'The payload is too large. The payload must be less than the server limit.',
  })
  @ApiOkResponse({
    description:
      'The building/rebuilding of the Singularity image was successfully triggered',
    type: String,
  })
  @HttpCode(HttpStatus.OK)
  @ApiInternalServerErrorResponse({
    description:
      'An error occurred in triggering the building/rebuilding of the Singularity image',
    type: ErrorResponseDocument,
  })
  @permissions(scopes.images.refresh.id)
  @Post('refresh')
  public async refreshImage(
    @Body() data: refreshImageBody,
  ): Promise<string | undefined> {
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
