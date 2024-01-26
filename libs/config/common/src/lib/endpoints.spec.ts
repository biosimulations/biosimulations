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

  it('Should not read environment variables in browser', () => {
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
  });

  it('Should return external endpoints when external flag is true', () => {
    expect(endpoints.getApiBaseUrl(true)).toBe('externalApi');
    expect(endpoints.getSimulatorsApiBaseUrl(true)).toBe('externalSimulatorsApi');
    expect(endpoints.getCombineApiBaseUrl(true)).toBe('externalCombineApi');
  });

  it('Should return correct ontology url based on app', () => {
    expect(endpoints.getOntologyEndpoint('simulators', true)).toBe('externalSimulatorsApi/ontologies');
    expect(endpoints.getOntologyEndpoint('simulations', true)).toBe('externalApi/ontologies');
  });

  it('Should return correct ontology url for ontology name', () => {
    expect(endpoints.getOntologyEndpoint('simulators', true, 'KISAO')).toBe('externalSimulatorsApi/ontologies/KISAO');
  });

  it('Should return correct ontology url for ontology term', () => {
    expect(endpoints.getOntologyEndpoint('simulators', true, 'KISAO', 'KISAO_0000019')).toBe(
      'externalSimulatorsApi/ontologies/KISAO/KISAO_0000019',
    );
  });

  it('Should return throw error for ontology term without ontology name', () => {
    expect(() => {
      endpoints.getOntologyEndpoint('simulators', true, undefined, 'KISAO_0000019');
    }).toThrow('Cannot get a term without an ontology id');
  });

  it('Should return correct ontology url for ontology terms', () => {
    expect(endpoints.getOntologyTermsEndpoint('simulators', true)).toBe('externalSimulatorsApi/ontologies/terms');
  });
});
