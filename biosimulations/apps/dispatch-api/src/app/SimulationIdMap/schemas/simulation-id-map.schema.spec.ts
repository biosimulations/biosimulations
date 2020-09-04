import { SimulationIdMap } from './simulation-id-map.schema';

describe('SimulationIdMap', () => {
  it('should create an instance', () => {
    expect(
      new SimulationIdMap('9dnwjxns93-wsnxjswjx92jnz-98nxz', 'Vilar')
    ).toBeTruthy();
  });
});
