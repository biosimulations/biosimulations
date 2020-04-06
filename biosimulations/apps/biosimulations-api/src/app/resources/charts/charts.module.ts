import { Module } from '@nestjs/common';
import { ChartsController } from './charts.controller';
import { ChartsService } from './charts.service';

@Module({
  controllers: [ChartsController],
  providers: [ChartsService],
})
export class ChartsModule {}
