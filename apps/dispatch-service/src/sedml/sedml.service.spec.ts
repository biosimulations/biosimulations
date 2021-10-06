import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import { SimulationRunService } from '@biosimulations/backend-api-client';
import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { CombineWrapperService } from '../combineWrapper.service';
import { SedmlService } from './sedml.service';

describe('SedmlService', () => {
  let service: SedmlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BiosimulationsConfigModule, HttpModule],
      providers: [
        SedmlService,
        { provide: CombineWrapperService, useValue: {} },
        { provide: SimulationRunService, useValue: {} },
      ],
    }).compile();

    service = module.get<SedmlService>(SedmlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
