import { Test, TestingModule } from '@nestjs/testing';
import { SbatchService } from './sbatch.service';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import { FilePaths } from '@biosimulations/shared/storage';
describe('SbatchService', () => {
  let service: SbatchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SbatchService, { provide: FilePaths, useValue: {} }],
      imports: [BiosimulationsConfigModule],
    }).compile();

    service = module.get<SbatchService>(SbatchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
