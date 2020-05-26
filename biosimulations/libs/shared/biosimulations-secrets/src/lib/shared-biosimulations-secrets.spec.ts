import { sharedBiosimulationsSecrets } from './shared-biosimulations-secrets';

describe('sharedBiosimulationsSecrets', () => {
  it('should work', () => {
    expect(sharedBiosimulationsSecrets()).toEqual(
      'shared-biosimulations-secrets',
    );
  });
});
