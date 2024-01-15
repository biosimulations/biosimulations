import { DataPaths } from './data-paths';
describe('DataPaths', () => {
  let dataPaths: DataPaths;

  beforeAll(() => {
    dataPaths = new DataPaths();
  });

  it('Should be created', () => {
    expect(dataPaths).toBeDefined();
  });

  it('Should calculate correct paths', () => {
    expect(dataPaths.getSimulationRunResultsPath()).toBe('/results');
    expect(dataPaths.getSimulationRunResultsPath('x')).toBe('/results/x');
  });

  it('Should calculate correct domains', () => {
    expect(dataPaths.getSimulationRunResultsDomain()).toBe('results');
    expect(dataPaths.getSimulationRunResultsDomain('x')).toBe('x.results');
  });
});
