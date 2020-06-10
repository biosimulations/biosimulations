import { Ssh, SSHConnectionConfig } from './ssh';

describe('Ssh', () => {
  it('should be defined', () => {
    expect(new Ssh(new SSHConnectionConfig(),new SSHConnectionConfig())).toBeDefined();
  });
});
