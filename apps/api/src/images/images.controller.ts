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
import {
  ApiBody,
  ApiOperation,
  ApiTags,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { refreshImageBody } from './image.dto';
import { ErrorResponseDocument } from '@biosimulations/datamodel/api';

@Controller('images')
@ApiTags('Internal management')
export class ImagesController {
  constructor(@Inject('NATS_CLIENT') private client: ClientProxy) {}

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
  @ApiCreatedResponse({
    description:
      'The building/rebuilding of the Singularity image was successfully triggered',
    type: String,
  })
  @ApiInternalServerErrorResponse({
    description:
      'An error occurred in triggering the building/rebuilding of the Singularity image',
    type: ErrorResponseDocument,
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDocument,
    description: 'A valid authorization was not provided',
  })
  @ApiForbiddenResponse({
    type: ErrorResponseDocument,
    description:
      'This account does not have permission to trigger the building/rebuilding of images',
  })
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
