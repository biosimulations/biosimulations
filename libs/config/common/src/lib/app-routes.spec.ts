import { AppRoutes } from './app-routes';
describe('AppRoutes', () => {
  let prodAppRoutes: AppRoutes;
  let devAppRoutes: AppRoutes;
  const { window } = global;
  const pointers = {
    prod: '.org',
    dev: '.dev',
  };

  beforeAll(() => {
    // @ts-ignore
    delete global.window;
  });

  afterAll(() => {
    global.window = window;
  });

  beforeEach(() => {
    jest.resetModules(); // Most important - it clears the cache

    const module = require('./app-routes');

    prodAppRoutes = new module.AppRoutes('prod');
    devAppRoutes = new module.AppRoutes('dev');
  });

  it('Should be created', () => {
    expect(prodAppRoutes).toBeDefined();
    expect(devAppRoutes).toBeDefined();
  });

  it('Should load correct environment', () => {
    expect(prodAppRoutes.getSimulatorsAppHome()).toBe('https://biosimulators.org');
    expect(devAppRoutes.getSimulatorsAppHome()).toBe('https://biosimulators.dev');

    expect(prodAppRoutes.getDispatchAppHome()).toBe('https://run.biosimulations.org');
    expect(devAppRoutes.getDispatchAppHome()).toBe('https://run.biosimulations' + pointers.prod);

    expect(prodAppRoutes.getPlatformAppHome()).toBe('https://biosimulations.org');
    expect(devAppRoutes.getPlatformAppHome()).toBe('https://biosimulations.dev');
  });

  it('Should not read environment variables in browser', () => {
    global.window = window;
    jest.resetModules(); // Most important - it clears the cache
    const module = require('./app-routes');
    prodAppRoutes = new module.AppRoutes('prod');
    devAppRoutes = new module.AppRoutes('dev');

    expect(prodAppRoutes.getPlatformAppHome()).toBe('https://biosimulations.org');
    expect(devAppRoutes.getPlatformAppHome()).toBe('https://biosimulations.dev');
    // @ts-ignore
    delete global.window;
  });

  it('Should calculate correct simulators views', () => {
    expect(prodAppRoutes.getSimulatorsView()).toBe('https://biosimulators.org/simulators');
    expect(devAppRoutes.getSimulatorsView()).toBe('https://biosimulators.dev/simulators');

    expect(prodAppRoutes.getSimulatorsView('copasi')).toBe('https://biosimulators.org/simulators/copasi');
    expect(devAppRoutes.getSimulatorsView('copasi')).toBe('https://biosimulators.dev/simulators/copasi');

    expect(prodAppRoutes.getSimulatorsView('copasi', '1')).toBe('https://biosimulators.org/simulators/copasi/1');
    expect(devAppRoutes.getSimulatorsView('copasi', '1')).toBe('https://biosimulators.dev/simulators/copasi/1');
  });

  it('Should calculate correct simulation run views', () => {
    expect(prodAppRoutes.getSimulationRunsView()).toBe('https://run.biosimulations.org/runs');
    expect(devAppRoutes.getSimulationRunsView()).toBe('https://run.biosimulations' + pointers.prod + '/runs');

    expect(prodAppRoutes.getSimulationRunsView('xyz')).toBe('https://run.biosimulations.org/runs/xyz');
    expect(devAppRoutes.getSimulationRunsView('xyz')).toBe('https://run.biosimulations' + pointers.prod + '/runs/xyz');
  });

  it('Should calculate correct projects views', () => {
    expect(prodAppRoutes.getProjectsView()).toBe('https://biosimulations.org/projects');
    expect(devAppRoutes.getProjectsView()).toBe('https://biosimulations.dev/projects');

    expect(prodAppRoutes.getProjectsView('abc')).toBe('https://biosimulations.org/projects/abc');
    expect(devAppRoutes.getProjectsView('abc')).toBe('https://biosimulations.dev/projects/abc');
  });

  it('Should calculate correct conventions views', () => {
    expect(prodAppRoutes.getConventionsView()).toBe('https://docs.biosimulations.org/concepts/conventions/');
    expect(devAppRoutes.getConventionsView()).toBe('https://docs.biosimulations.org/concepts/conventions/');

    expect(prodAppRoutes.getConventionsView('abc')).toBe('https://docs.biosimulations.org/concepts/conventions/abc/');
    expect(devAppRoutes.getConventionsView('abc')).toBe('https://docs.biosimulations.org/concepts/conventions/abc/');
  });
});
