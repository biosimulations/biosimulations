import { Controller, Get } from '@nestjs/common';
import { SharedStorageService } from './shared-storage.service';

@Controller('s3test')
export class TestController {
  public constructor(private service: SharedStorageService) {}
  @Get()
  public async testMethod() {
    console.log(await this.service.getBuckets());
  }
}
