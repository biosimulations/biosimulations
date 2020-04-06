import { Module } from '@nestjs/common';
import { ModelsService } from './models.service';
import { ModelsController } from './models.controller';

@Module({
  providers: [ModelsService],
  controllers: [ModelsController]
})
export class ModelsModule {}
