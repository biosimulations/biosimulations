import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import { Client as SSHClient } from 'ssh2';

export class SshConnectionConfig {
  public constructor(
    public host: string,
    public port: number,
    public username: string,
    public privateKey: string,
  ) {}
}

@Injectable({})
export class SshService {
  private connection!: SSHClient;
  private sshConfig: SshConnectionConfig =
    this.configService.get<SshConnectionConfig>(
      'hpc.ssh',
      new SshConnectionConfig('', 0, '', ''),
    );

  private retry = 1;
  private logger = new Logger('SshService');
  private hpcBase: string = this.configService.get<string>(
    'hpc.hpcBaseDir',
    '',
  );
  public constructor(private configService: ConfigService) {
    this.connection = this.initConnection();
  }

  public getSSHJobDirectory(id: string): string {
    return path.join(this.hpcBase, id);
  }

  public getSSHJobOutputsDirectory(id: string): string {
    return path.join(this.hpcBase, id, 'outputs');
  }
  public execStringCommand(
    cmd: string,
  ): Promise<{ stdout: string; stderr: string }> {
    this.logger.debug(`Executing command`);

    return new Promise<{ stdout: string; stderr: string }>(
      (resolve, reject) => {
        let stdout = '';
        let stderr = '';

        this.connection.exec(cmd, (err, stream) => {
          if (err) {
            this.logger.error(err);
            reject(err);
            this.connection.end();
          }
          if (stream) {
            stream

              .on('close', (code: any, signal: any) => {
                this.logger.debug(
                  'Stream :: close :: code: ' + code + ', signal: ' + signal,
                );
                resolve({ stdout, stderr });
              })
              .on('data', (data: any) => {
                stdout += data.toString('utf8');
              })
              .stderr.on('data', (data) => {
                stderr += data.toString('utf8');
              });
          } else {
            this.logger.error('Stream is null');
            reject('Stream is null');
          }
        });
      },
    );
  }

  private initConnection(): SSHClient {
    const config = this.sshConfig;
    this.logger.debug('Initializing connection');

    const connection = new SSHClient();
    this.addConnectionListeners(connection);
    return connection.connect(config);
  }

  private retryInit(): void {
    this.logger.log('Retrying SSH connection');
    setTimeout(
      () => (this.connection = this.initConnection()),
      this.getRetryBackoff(),
    );
  }
  private addConnectionListeners(connection: SSHClient): SSHClient {
    return connection
      .on('ready', () => {
        this.retry = 1;
        this.logger.debug('Connection ready');
      })

      .on('timeout', (message: string) => {
        this.logger.error(`Connection timeout: ${message}`);
      })

      .on('error', (err) => {
        this.logger.error('Connection Error: ' + err);

        connection.removeAllListeners();
        this.retryInit();
      })

      .on('end', () => {
        this.logger.error('Connection end');
        connection.removeAllListeners();
        this.retryInit();
      })

      .on('close', () => {
        this.logger.log('Connection closed');
        connection.removeAllListeners();
        connection = this.initConnection();
      });
  }

  private getRetryBackoff(): number {
    const MAX_RETRY_BACKOFF = 60 * 1000;
    if (this.retry < MAX_RETRY_BACKOFF) {
      this.retry = this.retry * 2;
    }
    return this.retry;
  }
}
