import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import { BullModule } from '@ejhayes/nestjs-bullmq';
import { BullHealthIndicator, HealthCheckProcessor } from './bullHealthCheck';

@Module({
  imports: [
    TerminusModule,
    BiosimulationsConfigModule,
    BullModule.registerQueue({
      name: 'health',
    }),
  ],
  providers: [HealthCheckProcessor, BullHealthIndicator],
  controllers: [HealthController],
})
export class HealthModule {}
