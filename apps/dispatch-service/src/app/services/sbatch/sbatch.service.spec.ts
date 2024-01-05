import { Test, TestingModule } from '@nestjs/testing';
import { SbatchService } from './sbatch.service';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import { FilePaths } from '@biosimulations/shared/storage';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { EnvironmentVariable, Purpose } from '@biosimulations/datamodel/common';
import { expectedValue } from './expected_sbatch';

describe('SbatchService', () => {
  let service: SbatchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SbatchService,
        {
          provide: FilePaths,
          useValue: {
            getSimulationRunPath: jest.fn().mockReturnValue('mockpath'),
            getSimulationRunOutputsPath: jest.fn().mockReturnValue('mockpath'),
            getSimulationRunOutputFilePath: jest.fn().mockReturnValue('mockpath'),
            getSimulationRunContentFilePath: jest.fn().mockReturnValue('mockpath'),
          },
        },
      ],
      imports: [BiosimulationsConfigModule],
    }).compile();

    service = module.get<SbatchService>(SbatchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // write a test case for SbatchService.generateRunSimulationSbatch function
  it('should return the expected sbatch script', () => {
    const runID = '239298383';
    const simulator = 'simulator_1';
    const simulatorVersion = '1.0.0';
    const cpus = 1;
    const memory = 1;
    const maxTime = 1;
    const envVars: EnvironmentVariable[] = [];
    const purpose: Purpose = Purpose.academic;
    const workDirname = 'workDirname_1';
    const result = service.generateRunSimulationSbatch(
      runID,
      simulator,
      simulatorVersion,
      cpus,
      memory,
      maxTime,
      envVars,
      purpose,
      workDirname,
    );
    expect(typeof result).toBe('string');
    expect(result).toBe(expectedValue);
    // process.stdout.write(result); // print the expected script
  });
});
