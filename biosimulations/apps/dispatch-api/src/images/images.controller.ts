import { permissions } from '@biosimulations/auth/nest';
import { ImageMessage, ImageMessagePayload, ImageMessageResponse } from '@biosimulations/messages/messages';
import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { map, pluck } from 'rxjs/operators';
import { refreshImageBody } from './image.dto';

@Controller('images')
@ApiResponse({})
@ApiTags('Images', 'Internal')

export class ImagesController {
    constructor(@Inject("NATS_CLIENT") private client: ClientProxy) { }
    @ApiOperation({ summary: "Refresh Container Image", description: "Trigger a rebuild of the singulairty image of a particular container" })
    @ApiBody({ type: refreshImageBody })
    @permissions("refresh:Images")
    @Post('refresh')
    @HttpCode(HttpStatus.NO_CONTENT)
    async refreshImage(@Body() data: refreshImageBody) {
        const message = new ImageMessagePayload(data.simulator, data.simulator)
        // !Replace with wrapper to allow typing 
        const success = await this.client.send(ImageMessage.refresh, message).pipe<boolean>(
            map((data: ImageMessageResponse) => data.okay)
        ).toPromise()
        if (success) {
            return
        } else {
            throw Error()
        }


    }



}
