import { Test, TestingModule } from '@nestjs/testing';
import { HpcService } from './hpc.service';
import { SshService } from '../ssh/ssh.service';
import { ConfigService } from '@nestjs/config';

describe('HpcService', () => {
  let service: HpcService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HpcService, SshService, ConfigService],
    }).compile();

    service = module.get<HpcService>(HpcService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
