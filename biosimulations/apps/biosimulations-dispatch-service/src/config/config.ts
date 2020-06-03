export default () => ({
    hpc: {
      // Follows format from SSHConnectionConfig
      ssh: {
        host: process.env.HPC_SSH_HOST,
        port: process.env.HPC_SSH_PORT,
        username: process.env.HPC_SSH_USERNAME,
        password: process.env.HPC_SSH_PASSWORD
      },
      // Follows format from SSHConnectionConfig
      sftp: {
        host: process.env.HPC_SFTP_HOST,
        port: process.env.HPC_SFTP_PORT,
        username: process.env.HPC_SFTP_USERNAME,
        password: process.env.HPC_SFTP_PASSWORD
      }
    }
  });
  