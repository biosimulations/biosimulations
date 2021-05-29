import { SshConnectionConfig } from './ssh-connection-config';

describe('SshConnectionConfig', () => {
  it('should be defined', () => {
    expect(new SshConnectionConfig('', 0, '', '')).toBeDefined();
  });
});
