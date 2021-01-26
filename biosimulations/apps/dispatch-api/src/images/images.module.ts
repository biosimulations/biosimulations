import { BiosimulationsAuthModule } from '@biosimulations/auth/nest';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import { SharedNatsClientModule } from '@biosimulations/shared/nats-client';
import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';

@Module({
  imports: [
    BiosimulationsConfigModule,
    BiosimulationsAuthModule,
    SharedNatsClientModule,
  ],
  controllers: [ImagesController],
})
export class ImagesModule {}
