import { Controller, Get, Param } from '@nestjs/common';
import { SharedStorageService } from './shared-storage.service';

@Controller('s3test')
export class TestController {
  public constructor(private service: SharedStorageService) {}
  @Get("/:id")
  public async testMethod(@Param("id") id:string): any {
    return this.service.getObject(id)
  }
}
