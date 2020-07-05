import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { ConfigService } from '@nestjs/config';
import { HpcService } from './services/hpc/hpc.service';
import { SshService } from './services/ssh/ssh.service';
import { SbatchService } from './services/sbatch/sbatch.service';


describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [ConfigService, HpcService, SshService, SbatchService],
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
