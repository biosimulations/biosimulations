import { Endpoints } from './endpoints';
describe('Endpoints', () => {
  let prod_endpoints: Endpoints;
  let dev_endpoints: Endpoints;
  let dummy_endpoints: Endpoints;
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

    prod_endpoints = new endpointsModule.Endpoints('prod');
    dev_endpoints = new endpointsModule.Endpoints('dev');
    dummy_endpoints = new endpointsModule.Endpoints('dummy');
  });

  it('Should be created', () => {
    expect(prod_endpoints).toBeDefined();
    expect(dev_endpoints).toBeDefined();
  });

  it('Should not read environment variables in browser', () => {
    global.window = window;
    jest.resetModules(); // Most important - it clears the cache
    const endpointsModule = require('./endpoints');
    prod_endpoints = new endpointsModule.Endpoints('prod');

    expect(prod_endpoints.getApiBaseUrl(true)).not.toBe('externalApi');
    // @ts-ignore
    delete global.window;
  });

  it('Should read environment variables for endpoint overrides', () => {
    expect(dummy_endpoints.getSimulatorsApiBaseUrl(false)).toBe('simulatorsApi');
    expect(dev_endpoints.getSimulatorsApiBaseUrl(false)).toBe('https://api.biosimulators.dev');
    expect(prod_endpoints.getSimulatorsApiBaseUrl(false)).toBe('https://api.biosimulators.org');
    expect(dummy_endpoints.getApiBaseUrl(false)).toBe('api');
    expect(dev_endpoints.getApiBaseUrl(false)).toBe('https://api.biosimulations.dev');
    expect(prod_endpoints.getApiBaseUrl(false)).toBe('https://api.biosimulations.org');
    expect(dummy_endpoints.getCombineApiBaseUrl(false)).toBe('combineApi');
    expect(dev_endpoints.getCombineApiBaseUrl(false)).toBe('https://combine.api.biosimulations.dev');
    expect(prod_endpoints.getCombineApiBaseUrl(false)).toBe('https://combine.api.biosimulations.org');
    expect(dummy_endpoints.getSimdataApiBaseUrl(false)).toBe('simdataApi');
    expect(dev_endpoints.getSimdataApiBaseUrl(false)).toBe('https://simdata.api.biosimulations.dev');
    expect(prod_endpoints.getSimdataApiBaseUrl(false)).toBe('https://simdata.api.biosimulations.org');
  });

  it('Should return external endpoints when external flag is true', () => {
    expect(dummy_endpoints.getApiBaseUrl(true)).toBe('externalApi');
    expect(dummy_endpoints.getSimulatorsApiBaseUrl(true)).toBe('externalSimulatorsApi');
    expect(dummy_endpoints.getCombineApiBaseUrl(true)).toBe('externalCombineApi');
    expect(dummy_endpoints.getSimdataApiBaseUrl(true)).toBe('externalSimdataApi');
  });

  it('Should return correct ontology url based on app', () => {
    expect(dummy_endpoints.getOntologyEndpoint('simulators', true)).toBe('externalSimulatorsApi/ontologies');
    expect(dummy_endpoints.getOntologyEndpoint('simulations', true)).toBe('externalApi/ontologies');
  });

  it('Should return correct ontology url for ontology name', () => {
    expect(dummy_endpoints.getOntologyEndpoint('simulators', true, 'KISAO')).toBe(
      'externalSimulatorsApi/ontologies/KISAO',
    );
  });

  it('Should return correct ontology url for ontology term', () => {
    expect(dummy_endpoints.getOntologyEndpoint('simulators', true, 'KISAO', 'KISAO_0000019')).toBe(
      'externalSimulatorsApi/ontologies/KISAO/KISAO_0000019',
    );
  });

  it('Should return throw error for ontology term without ontology name', () => {
    expect(() => {
      dummy_endpoints.getOntologyEndpoint('simulators', true, undefined, 'KISAO_0000019');
    }).toThrow('Cannot get a term without an ontology id');
  });

  it('Should return correct ontology url for ontology terms', () => {
    expect(dummy_endpoints.getOntologyTermsEndpoint('simulators', true)).toBe('externalSimulatorsApi/ontologies/terms');
  });
});
