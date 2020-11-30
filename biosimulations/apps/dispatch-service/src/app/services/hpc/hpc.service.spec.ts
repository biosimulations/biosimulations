import { Test, TestingModule } from '@nestjs/testing';
import { HpcService } from './hpc.service';
import { SshService } from '../ssh/ssh.service';
import { ConfigService } from '@nestjs/config';
import {
  ClientProxyFactory,
  Transport,
  NatsOptions,
} from '@nestjs/microservices';
import { SbatchService } from '../sbatch/sbatch.service';

describe('HpcService', () => {
  let service: HpcService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HpcService,
        SshService,
        ConfigService,
        SbatchService,
        {
          provide: 'DISPATCH_MQ',
          useFactory: (configService: ConfigService) => {
            const natsServerConfig = configService.get('nats');
            const natsOptions: NatsOptions = {};
            natsOptions.transport = Transport.NATS;
            natsOptions.options = natsServerConfig;
            return ClientProxyFactory.create(natsOptions);
          },
          inject: [ConfigService],
        },
      ],
    }).compile();

    service = module.get<HpcService>(HpcService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
