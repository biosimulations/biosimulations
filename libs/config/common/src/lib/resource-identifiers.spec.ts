import { ResourceIdentifiers } from './resource-identifiers';
describe('ResourceIdentifiers', () => {
  let resourceIdentifiers: ResourceIdentifiers;

  beforeAll(() => {
    resourceIdentifiers = new ResourceIdentifiers();
  });

  it('Should be created', () => {
    expect(resourceIdentifiers).toBeDefined();
  });

  it('Should return correct simulator id', () => {
    expect(resourceIdentifiers.getSimulatorIdentifier('copasi')).toBe(
      'http://identifiers.org/biosimulators:copasi',
    );
  });

  it('Should return correct simulation run id', () => {
    expect(resourceIdentifiers.getSimulationRunIdentifier('xyz')).toBe(
      'http://identifiers.org/runbiosimulations:xyz',
    );
  });

  it('Should return correct simulation project id', () => {
    expect(resourceIdentifiers.getProjectIdentifier('abc')).toBe(
      'http://identifiers.org/biosimulations:abc',
    );
  });
});
