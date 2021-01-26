import { registerAs } from '@nestjs/config';

// Note: In 'privateKey' add \n at the end of each line and paste as single line within double quotes

export default registerAs('hpc', () => {
  const config = {
    ssh: {
      host: process.env.HPC_SSH_HOST,
      port: process.env.HPC_SSH_PORT,
      username: process.env.HPC_SSH_USERNAME,
      privateKey: process.env.HPC_SSH_PRIVATE_KEY,
    },
    homeDir: process.env.HPC_HOME_DIR || '/home/FCAM/crbmapi',
    fileStorage: process.env.FILE_STORAGE,
    hpcBaseDir: process.env.HPC_BASE_DIR,
  };

  return config;
});
