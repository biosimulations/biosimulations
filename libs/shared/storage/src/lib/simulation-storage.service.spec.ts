import { Test } from '@nestjs/testing';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import { S3Module } from 'nestjs-s3';
import { SimulationStorageService } from './simulation-storage.service';
import { SharedStorageService } from './shared-storage.service';
import { FilePaths } from './file-paths';

describe('SimulationStorageService', () => {
  let service: SimulationStorageService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        BiosimulationsConfigModule,
        S3Module.forRoot({
          config: {
            credentials: {
              accessKeyId: '',
              secretAccessKey: '',
            },
            endpoint: 'https://storage.googleapis.com',
            s3ForcePathStyle: true,
            region: 'us-east-1',
          },
        }),
      ],
      providers: [
        SimulationStorageService,
        { provide: SharedStorageService, useValue: {} },
        { provide: FilePaths, useValue: {} },
      ],
    }).compile();

    service = module.get(SimulationStorageService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
