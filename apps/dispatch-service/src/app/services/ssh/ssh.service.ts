import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client as SSHClient } from 'ssh2';
import { SshConnectionConfig } from '../../types/ssh-connection-config/ssh-connection-config';

@Injectable()
export class SshService {
  private sshConfig: SshConnectionConfig =
    this.configService.get<SshConnectionConfig>(
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
}
