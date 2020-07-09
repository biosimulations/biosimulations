import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { ConfigService } from '@nestjs/config';
import { HpcService } from './services/hpc/hpc.service';
import { SshService } from './services/ssh/ssh.service';
import { SbatchService } from './services/sbatch/sbatch.service';
import { ClientProxyFactory, Transport, NatsOptions } from '@nestjs/microservices';


describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        ConfigService,
        HpcService,
        SshService,
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
        }
      ],
    }).compile();
  });

  describe('uploadFile', () => {
    it('should return "Unsupported simulator was provided!"', () => {
      const appController = app.get<AppController>(AppController);
      // tslint:disable-next-line: deprecation
      expect(appController.uploadFile({
          simulator: 'BIONETGEN',
          filename: '' , 
          uniqueFilename: '',
          filepathOnDataStore: ''})).toEqual({
        message: 'Unsupported simulator was provided!'
      });
    });
  });
});
