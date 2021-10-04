import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import { Client as SSHClient } from 'ssh2';

export class SshConnectionConfig {
  constructor(
    public host: string,
    public port: number,
    public username: string,
    public privateKey: string,
  ) {}
}
@Injectable()
export class SshService {
  private sshConfig: SshConnectionConfig =
    this.configService.get<SshConnectionConfig>(
      'hpc.ssh',
      new SshConnectionConfig('', 0, '', ''),
    );

  private logger = new Logger('SshService');

  private hpcBase: string = this.configService.get<string>(
    'hpc.hpcBaseDir',
    '',
  );
  constructor(private configService: ConfigService) {}
  public getSSHResultsDirectory(id: string): string {
    return path.join(this.hpcBase, id);
  }
  public execStringCommand(
    cmd: string,
  ): Promise<{ stdout: string; stderr: string }> {
    return new Promise<{ stdout: string; stderr: string }>(
      (resolve, reject) => {
        const conn = new SSHClient();
        conn
          .on('ready', () => {
            this.logger.debug('Connection ready');
            let stdout = '';
            let stderr = '';
            conn.exec(cmd, (err, stream) => {
              if (err) {
                this.logger.error(err);
                reject(err);
              }
              stream
                .on('close', (code: any, signal: any) => {
                  this.logger.debug(
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
