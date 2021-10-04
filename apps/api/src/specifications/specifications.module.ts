import { BiosimulationsAuthModule } from '@biosimulations/auth/nest';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SpecificationsController } from './specifications.controller';
import {
  SpecificationsModel,
  SpecificationsModelSchema,
} from './specifications.model';
import { SpecificationsService } from './specifications.service';

@Module({
  controllers: [SpecificationsController],
  imports: [
    BiosimulationsAuthModule,
    MongooseModule.forFeature([
      { name: SpecificationsModel.name, schema: SpecificationsModelSchema },
    ]),
  ],
  providers: [SpecificationsService],
})
export class SpecificationsModule {}
