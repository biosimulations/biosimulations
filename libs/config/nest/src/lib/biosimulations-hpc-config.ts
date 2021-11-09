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
    hpcBaseDir: process.env.HPC_BASE_DIR,
    homeDir: process.env.HPC_HOME_DIR,
    executablesPath: process.env.HPC_EXECUTABLES_PATH,
    module: {
      path: process.env.HPC_MODULE_PATH,
      initScript: process.env.HPC_MODULE_INIT_SCRIPT,
    },
    slurm: {
      partition: process.env.HPC_SLURM_PARTITION,
      qos: process.env.HPC_SLURM_QOS,
    },
    singularity: {
      module: process.env.HPC_SINGULARITY_MODULE,
      cacheDir: process.env.HPC_SINGULARITY_CACHE_DIR,
      pullFolder: process.env.HPC_SINGULARITY_PULL_FOLDER,
    },
    buildSingularityImage: {
      maxTime: process.env.HPC_BUILD_SINGULARITY_IMAGE_MAX_TIME,
      cpus: process.env.HPC_BUILD_SINGULARITY_IMAGE_CPUS,
      memory: process.env.HPC_BUILD_SINGULARITY_IMAGE_MEMORY,
    },
    fileStorage: process.env.FILE_STORAGE,    
  };

  return config;
});
