import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import { BullModule } from '@biosimulations/nestjs-bullmq';
import { BullHealthIndicator, HealthCheckProcessor } from './bullHealthCheck';
import { BullModuleOptions } from '@biosimulations/messages/messages';

@Module({
  imports: [
    TerminusModule,
    BiosimulationsConfigModule,
    BullModule.registerQueue({
      name: 'health',
      ...BullModuleOptions,
    }),
  ],
  providers: [HealthCheckProcessor, BullHealthIndicator],
  controllers: [HealthController],
})
export class HealthModule {}
