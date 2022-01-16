import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from 'aws-sdk';
import { FilePaths } from './file-paths';

describe('FilePaths', () => {
  let filePaths: FilePaths;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BiosimulationsConfigModule],
      providers: [FilePaths, ConfigService],
    }).compile();
    filePaths = module.get<FilePaths>(FilePaths);
  });

  it('Should be created', () => {
    expect(filePaths).toBeDefined();
  });

  it('Should return correct S3 URL', () => {
    expect(filePaths.getSimulationRunFileContentEndpoint('x', 'file.txt')).toBe(
      'https://storage.googleapis.com/files.biosimulations.dev/simulations/x/contents/file.txt',
    );
  });

  it('Should return correct S3 filepath', () => {
    expect(
      filePaths.getSimulationRunContentFilePath('testSim', 'testFile'),
    ).toBe('simulations/testSim/contents/testFile');
  });
});
