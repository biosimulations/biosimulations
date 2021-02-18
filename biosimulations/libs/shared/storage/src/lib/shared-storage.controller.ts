import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { SharedStorageService } from './shared-storage.service';
import { Response } from 'express';

import { Readable } from 'stream';
@ApiTags('S3 Storage')
@Controller('s3test')
export class s3TestController {
  public constructor(private service: SharedStorageService) {}
  @Get('/:id')
  public async getFile(
    @Param('id') id: string,
    @Res({ passthrough: false }) res: Response,
  ): Promise<void> {
    const data = await this.service.getObject(id);
    if (data.Body) {
      const stream = Readable.from(data.Body as Buffer);
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${id.split('/').reverse()[0]}"`,
      );
      res.setHeader(
        'Content-Type',
        `${data.ContentType || 'application/octet-stream'}`,
      );
      stream.pipe(res);
    }
  }

  @Post()
  @ApiConsumes(...['multipart/form-data', 'application/json'])
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        id: {
          type: 'string',
        },
      },
    },
  })
  uploadFile(@UploadedFile() file: any, @Body() body: { id: string }) {
    return this.service.putObject(body.id, file.buffer);
  }
}
