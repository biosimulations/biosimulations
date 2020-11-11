import { Module } from '@nestjs/common';
import { ResultsService } from './results.service';
import { ResultsController } from './results.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ResultsModel, ResultsSchema } from './results.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ResultsModel.name, schema: ResultsSchema },
    ]),
  ],
  providers: [ResultsService],
  controllers: [ResultsController],
})
export class ResultsModule {}
