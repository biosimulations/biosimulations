import { Module } from '@nestjs/common';
import { ResourcesController } from './resources.controller';

@Module({
  controllers: [ResourcesController]
})
export class ResourcesModule {}
