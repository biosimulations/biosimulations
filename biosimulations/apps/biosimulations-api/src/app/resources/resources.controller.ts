import { Controller, Get } from '@nestjs/common';

@Controller('resources')
export class ResourcesController {
  @Get()
  get() {
    return 'test';
  }
}
