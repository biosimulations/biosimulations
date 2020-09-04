import { SimulationIdMapModule } from './../simulation-id-map.module';
import { SimulationIdMapService } from './simulation-id-map.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { SimulationIdMap } from '../schemas/simulation-id-map.schema';

describe('SimulationIdMapService', () => {
  let service: SimulationIdMapService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      //   imports: [SimulationIdMapModule],
      providers: [
        SimulationIdMapService,
        {
          provide: getModelToken(SimulationIdMap.name),
          useValue: { uuid: '9384839-9jwnd', projectName: 'vilar' },
        },
      ],
    }).compile();

    service = module.get<SimulationIdMapService>(SimulationIdMapService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //   describe('create', () => {
  //     it('should create uuid and projectNmae mapping', () => {
  //       expect(
  //         service.create({ uuid: '9384839-9jwnd', projectName: 'vilar' })
  //       ).toEqual({
  //         message: 'OK',
  //       });
  //     });
  //   });
});
