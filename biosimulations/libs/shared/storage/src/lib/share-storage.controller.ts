import { Controller, Get,  Param, Res } from '@nestjs/common';
import { SharedStorageService } from './shared-storage.service';
import {Response} from 'express'

import { Readable } from 'stream'
@Controller("s3test")
export class TestController {
  public constructor(private service: SharedStorageService) {}
  @Get("/:id")
  public async getFile(@Param("id") id:string, @Res({passthrough: false}) res:Response ): Promise<void> {
    const data = (await this.service.getObject(id))
    if (data.Body) {
      const stream = Readable.from(data.Body as Buffer);  
      res.setHeader("Content-Disposition", `attachment; filename="${id.split("/").reverse()[0]}"`)
      res.setHeader("Content-Type", `${data.ContentType || 'application/octet-stream'}`)
      stream.pipe(res)
    }
      }
}
