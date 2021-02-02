import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client as SSHClient } from 'ssh2';
import * as fs from 'fs';
import { SshConnectionConfig } from '../../types/ssh-connection-config/ssh-connection-config';

@Injectable()
export class SshService {
  private sshConfig: SshConnectionConfig = this.configService.get<SshConnectionConfig>(
    'hpc.ssh',
    new SshConnectionConfig('', 0, '', ''),
  );
  private sftpConfig: SshConnectionConfig = this.configService.get(
    'hpc.sftp',
    new SshConnectionConfig('', 0, '', ''),
  );

  private logger = new Logger('SshService');

  constructor(private configService: ConfigService) {
    this.logger.log('SSH config host: ' + this.sshConfig.host);
    this.logger.log('SFTP config host: ' + this.sftpConfig.host);
  }

  public execStringCommand(
    cmd: string,
  ): Promise<{ stdout: string; stderr: string }> {
    return new Promise<{ stdout: string; stderr: string }>(
      (resolve, reject) => {
        const conn = new SSHClient();
        conn
          .on('ready', () => {
            this.logger.log('Connection ready');
            let stdout = '';
            let stderr = '';
            conn.exec(cmd, (err, stream) => {
              if (err) {
                this.logger.error(err);
                reject(err);
              }
              stream
                .on('close', (code: any, signal: any) => {
                  this.logger.log(
                    'Stream :: close :: code: ' + code + ', signal: ' + signal,
                  );
                  resolve({ stdout, stderr });
                  conn.end();
                  this.logger.log('Connection closed');
                })
                .on('data', (data: any) => {
                  stdout += data.toString('utf8');
                })
                .stderr.on('data', (data) => {
                  stderr += data.toString('utf8');
                });
            });
          })
          .on('error', (err) => {
            this.logger.error(err);
            reject(err);
          })
          .connect(this.sshConfig);
      },
    );
  }

  getFile(localFilePath: string, remoteFilePath: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const conn = new SSHClient();
      conn
        .on('ready', () => {
          this.logger.log('Connection ready');
          conn.sftp((err, sftp) => {
            if (err) {
              this.logger.error(
                'Unable to open SFTP connection',
                JSON.stringify(err),
              );
              reject(err);
            }

            sftp.fastGet(remoteFilePath, localFilePath, {}, (downloadError) => {
              if (downloadError) {
                this.logger.error(
                  'Error occured while downloading file',
                  JSON.stringify(downloadError),
                );
                reject(downloadError);
              }
              this.logger.log('File download successful');
              resolve(true);
            });
          });
        })
        .connect(this.sftpConfig);
    });
  }

  putFile(localFilePath: string, remoteFilePath: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const conn = new SSHClient();
      conn
        .on('ready', () => {
          this.logger.log('Connection ready');
          conn.sftp((err, sftp) => {
            if (err) {
              this.logger.error(
                'Unable to open SFTP connection',
                JSON.stringify(err),
              );
              reject(err);
            }

            const readStream = fs.createReadStream(localFilePath);
            const writeStream = sftp.createWriteStream(remoteFilePath);

            writeStream.on('close', () => {
              this.logger.log('File transferred successfully');
              resolve(true);
            });

            writeStream.on('end', () => {
              this.logger.log('SFTP connection closed');
              conn.destroy();
            });

            // initiate transfer of file
            readStream.pipe(writeStream);
          });
        })
        .connect(this.sftpConfig);
    });
  }

  listFiles(remoteDirPath: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      const conn = new SSHClient();
      conn
        .on('ready', () => {
          this.logger.log('Connection ready');
          conn.sftp((err: any, sftp: any) => {
            if (err) {
              this.logger.error(
                'Unable to open SFTP connection',
                JSON.stringify(err),
              );
              reject(err);
            }

            sftp.readdir(remoteDirPath, (readErr: any, list: any[]) => {
              if (readErr) {
                this.logger.error(
                  'Cannot read remote directory',
                  JSON.stringify(readErr),
                );
                reject(readErr);
              }
              resolve(list);
              conn.end();
              this.logger.log('SFTP connection closed successfully');
            });
          });
        })
        .connect(this.sftpConfig);
    });
  }
}
