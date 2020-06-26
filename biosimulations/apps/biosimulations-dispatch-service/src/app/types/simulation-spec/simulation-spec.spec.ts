import { SimulationSpec } from './simulation-spec';

describe('SimulationSpec', () => {
  it('should be defined', () => {
    expect(new SimulationSpec('copasi')).toBeDefined();
  });
});
