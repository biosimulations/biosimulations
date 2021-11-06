import { Controller, Get } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
  MongooseHealthIndicator,
  MicroserviceHealthIndicator,
  HealthIndicatorFunction,
  HealthCheckResult,
} from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';
import { Endpoints } from '@biosimulations/config/common';
import { BullHealthIndicator } from './bullHealthCheck';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@Controller('health')
@ApiTags('Health')
export class HealthController {
  private env = this.config.get('server.env');
  private endpoints = new Endpoints(this.env);
  private natsURL = this.config.get('nats.url');

  public constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: MongooseHealthIndicator,
    private microservice: MicroserviceHealthIndicator,
    private queue: BullHealthIndicator,
    private config: ConfigService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Check whether the database and simulation run queue are operational',
    description: 'Check whether the database and simulation run queue are operational',
  })
  @HealthCheck()
  public check(): Promise<HealthCheckResult> {
    return this.health.check([this.mongoCheck, this.bullCheck]);
  }

  @Get('/status')
  @ApiOperation({
    summary: 'Check whether all parts of the system are operational',
    description: 'Check whether all parts of the system are operational',
  })
  @HealthCheck()
  public checkStatus(): Promise<HealthCheckResult> {
    return this.health.check([
      this.combineCheck,
      this.mongoCheck,
      this.natsCheck,
      this.bullCheck,
      this.s3Check,
      this.simulatorsCheck,
      this.hpcCheck,
    ]);
  }

  @Get('/database')
  @ApiOperation({
    summary: 'Check whether the database is operational',
    description: 'Check whether the database is operational',
  })
  @HealthCheck()
  public databaseCheck(): Promise<HealthCheckResult> {
    return this.health.check([this.mongoCheck]);
  }

  @Get('/messaging')
  @ApiOperation({
    summary: 'Check whether the simulation run queue and messaging system are operational',
    description: 'Check whether the simulation run queue and messaging system are operational',
  })
  @HealthCheck()
  public messagingCheck(): Promise<HealthCheckResult> {
    return this.health.check([this.natsCheck, this.bullCheck]);
  }

  private simulatorsCheck: HealthIndicatorFunction = () =>
    this.http.pingCheck(
      'Simulators API',
      this.endpoints.getSimulatorApiHealthEndpoint(),
    );

  private combineCheck: HealthIndicatorFunction = () =>
    this.http.pingCheck(
      'combine-api',
      this.endpoints.getCombineHealthEndpoint(),
    );
  private mongoCheck: HealthIndicatorFunction = () =>
    this.db.pingCheck('Database');

  private natsCheck: HealthIndicatorFunction = () =>
    this.microservice.pingCheck('Messaging', {
      transport: Transport.NATS,
      options: {
        servers: [this.natsURL],
      },
    });

  private bullCheck: HealthIndicatorFunction = () =>
    this.queue.isHealthy('Queue');

  private s3Check: HealthIndicatorFunction = () =>
    this.http.pingCheck('Storage', this.endpoints.getStorageHealthEndpoint());

  private hpcCheck: HealthIndicatorFunction = () =>
    this.microservice.pingCheck('HPC', {
      transport: Transport.TCP,
      options: {
        host: this.config.get('hpc.ssh.host'),
        port: this.config.get('hpc.ssh.port'),
      },
    });
}
