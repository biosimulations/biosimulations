import { Module } from '@nestjs/common';
import { StatisticsApiController } from './statistics-api.controller';
import { StatisticsApiService } from './statistics-api.service';
import { MongooseModule } from '@nestjs/mongoose';
import { StatsItem, StatItemSchema } from './statistics-api.database.model';
import { BiosimulationsAuthModule } from '@biosimulations/auth/nest';
@Module({
  imports: [MongooseModule.forFeature([{ name: StatsItem.name, schema: StatItemSchema }]), BiosimulationsAuthModule],
  controllers: [StatisticsApiController],
  providers: [StatisticsApiService],
  exports: [StatisticsApiService],
})
export class StatisticsApiModule {}
