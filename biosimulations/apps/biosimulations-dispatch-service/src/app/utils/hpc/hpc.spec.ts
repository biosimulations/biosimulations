import { Hpc } from './hpc';
import { SSHConnectionConfig } from '../ssh/ssh';

describe('Hpc', () => {

  it('should be defined', () => {
    expect(new Hpc(new SSHConnectionConfig(), new SSHConnectionConfig())).toBeDefined();
  });
});
