import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  MongooseHealthIndicator,
  HealthCheckResult,
  HealthIndicatorFunction,
} from '@nestjs/terminus';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@Controller('health')
@ApiTags('Health')
export class HealthController {
  public constructor(
    private health: HealthCheckService,
    private db: MongooseHealthIndicator,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Check whether the API is operational',
    description: 'Check whether the API is operational',
  })
  @HealthCheck()
  public check(): Promise<HealthCheckResult> {
    return this.health.check([this.mongoCheck]);
  }

  private mongoCheck: HealthIndicatorFunction = () =>
    this.db.pingCheck('Database');
}
