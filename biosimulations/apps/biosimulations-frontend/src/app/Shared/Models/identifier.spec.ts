import { Identifier } from './identifier';

describe('Identifier', () => {
  it('should create an instance', () => {
    expect(new Identifier('biomodels.db', '001')).toBeTruthy();
  });
});
