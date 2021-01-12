import { permissions } from '@biosimulations/auth/nest';
import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { Client } from '@nestjs/microservices/external/nats-client.interface';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { refreshImageBody } from './image.dto';

@Controller('images')
@ApiTags('Images', 'Internal')
export class ImagesController {
    constructor(@Inject("NATS_CLIENT") private client: Client) { }
    @ApiOperation({})
    @ApiBody({ type: refreshImageBody })
    @permissions("refresh:images")
    @Post('refresh')
    refreshImage(@Body() data: refreshImageBody) {
        this.client.emit("test")
    }



}
