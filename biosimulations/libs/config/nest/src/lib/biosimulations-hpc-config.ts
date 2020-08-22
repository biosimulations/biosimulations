import { registerAs } from '@nestjs/config';

// Note: In privateKey add \n at the end of each line and paste as single line within double quotes

export default registerAs('hpc', () => {
  const config = {
    ssh: {
      host: process.env.HPC_SSH_HOST,
      port: process.env.HPC_SSH_PORT,
      username: process.env.HPC_SSH_USERNAME,
      privateKey: process.env.HPC_SSH_PRIVATE_KEY,
    },
    // Follows format from SSHConnectionConfig

    sftp: {
      host: process.env.HPC_SFTP_HOST,
      port: process.env.HPC_SFTP_PORT,
      username: process.env.HPC_SFTP_USERNAME,
      privateKey: process.env.HPC_SFTP_PRIVATE_KEY,
    },
    // TODO: Move Simdir base to config file
    simDirBase: '/home/FCAM/crbmapi/nfs/biosimulations/simulations',
  };

  return config;
});
