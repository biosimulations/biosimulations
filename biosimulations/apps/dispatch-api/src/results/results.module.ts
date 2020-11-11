import { Module } from '@nestjs/common';
import { ResultsService } from './results.service';
import { ResultsController } from './results.controller';

@Module({
  providers: [ResultsService],
  controllers: [ResultsController]
})
export class ResultsModule {}
