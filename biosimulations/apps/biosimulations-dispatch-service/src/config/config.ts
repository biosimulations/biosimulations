export default () => ({
    hpc: {
      ssh: {
        host: process.env.HPC_SSH_HOST,
        port: process.env.HPC_SSH_PORT,
        username: process.env.HPC_SSH_USERNAME,
        password: process.env.HPC_SSH_PASSWORD
      },
      sftp: {
        host: process.env.HPC_SFTP_HOST,
        port: process.env.HPC_SFTP_PORT,
        username: process.env.HPC_SFTP_USERNAME,
        password: process.env.HPC_SFTP_PASSWORD
      }
    },
    port: process.env.PORT || 3333,
  });
  