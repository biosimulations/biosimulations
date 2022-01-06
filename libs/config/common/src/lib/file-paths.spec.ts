import { FilePaths } from './file-paths';
describe('FilePaths', () => {
  let filePaths: FilePaths;

  beforeAll(() => {
    filePaths = new FilePaths('prod');
  });

  it('Should be created', () => {
    expect(filePaths).toBeDefined();
  });

  it('Should return correct S3 URL', () => {
    expect(
      filePaths.getSimulationRunFileContentEndpoint(true, 'x', 'file.txt'),
    ).toBe(
      'https://files.biosimulations.org/s3/simulations/x/contents/file.txt',
    );
  });

  it('Should return correct S3 filepath', () => {
    expect(
      filePaths.getSimulationRunContentFilePath('testSim', 'testFile'),
    ).toBe('simulations/testSim/contents/testFile');
  });
});
