import { registerAs } from '@nestjs/config';

export default registerAs('hpc', () => {
  const config = {
    ssh: {
      host: process.env.HPC_SSH_HOST,
      port: process.env.HPC_SSH_PORT,
      username: process.env.HPC_SSH_USERNAME,
      password: process.env.HPC_SSH_PASSWORD,
    },
    // Follows format from SSHConnectionConfig
    sftp: {
      host: process.env.HPC_SFTP_HOST,
      port: process.env.HPC_SFTP_PORT,
      username: process.env.HPC_SFTP_USERNAME,
      password: process.env.HPC_SFTP_PASSWORD,
    },
    simDirBase: '/home/CAM/crbmapi/simulations',
  };

  return config;
});
