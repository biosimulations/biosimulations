import { Endpoints } from './endpoints';
describe('Endpoints', () => {
  let endpoints: Endpoints;
  const { window } = global;

  beforeAll(() => {
    // @ts-ignore
    delete global.window;
  });

  afterAll(() => {
    global.window = window;
  });

  beforeEach(() => {
    jest.resetModules(); // Most important - it clears the cache

    const endpointsModule = require('./endpoints');

    endpoints = new endpointsModule.Endpoints('prod');
  });

  it('Should be created', () => {
    expect(endpoints).toBeDefined();
  });

  it('Should load correct environment', () => {
    expect(endpoints.getPlatformAppHome()).toBe('https://biosimulations.org');
  });

  it('Should not  read environment variables in browser', () => {
    global.window = window;
    jest.resetModules(); // Most important - it clears the cache
    const endpointsModule = require('./endpoints');
    endpoints = new endpointsModule.Endpoints('prod');

    expect(endpoints.getApiBaseUrl(true)).not.toBe('externalApi');
    // @ts-ignore
    delete global.window;
  });

  it('Should read environment variables for endpoint overrides', () => {
    expect(endpoints.getApiBaseUrl(false)).toBe('api');
    expect(endpoints.getSimulatorsApiBaseUrl(false)).toBe('simulatorsApi');
    expect(endpoints.getCombineApiBaseUrl(false)).toBe('combineApi');
    expect(endpoints.getStorageEndpointBaseUrl(false)).toBe('storage');
    expect(endpoints.getDataServiceBaseUrl(false)).toBe('dataService');
  });

  it('Should return external endpoints when external flag is true', () => {
    expect(endpoints.getApiBaseUrl(true)).toBe('externalApi');
    expect(endpoints.getSimulatorsApiBaseUrl(true)).toBe(
      'externalSimulatorsApi',
    );
    expect(endpoints.getCombineApiBaseUrl(true)).toBe('externalCombineApi');
    expect(endpoints.getStorageEndpointBaseUrl(true)).toBe('externalStorage');
    expect(endpoints.getDataServiceBaseUrl(true)).toBe('externalDataService');
  });

  it('Should return correct s3 filepath', () => {
    expect(
      endpoints.getSimulationRunContentFileS3Path('testSim', 'testFile'),
    ).toBe('simulations/testSim/contents/testFile');
  });
});
