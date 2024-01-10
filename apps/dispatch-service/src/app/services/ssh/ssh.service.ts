import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import { Client as SSHClient } from 'ssh2';

export class SshConnectionConfig {
  public constructor(public host: string, public port: number, public username: string, public privateKey: string) {}
}

@Injectable({})
export class SshService {
  private connection!: SSHClient;
  private sshConfig: SshConnectionConfig = this.configService.get<SshConnectionConfig>(
    'hpc.ssh',
    new SshConnectionConfig('', 0, '', ''),
  );

  private retry = 1;
  private logger = new Logger('SshService');
  private hpcBase: string = this.configService.get<string>('hpc.hpcBaseDir', '');
  public constructor(private configService: ConfigService) {
    const init = this.configService.get('hpc.sshInit', 'true');
    if (!(init == 'false')) {
      this.connection = this.initConnection();
    }
  }

  public getSSHJobDirectory(id: string): string {
    return path.join(this.hpcBase, id);
  }

  public getSSHJobOutputsDirectory(id: string): string {
    return path.join(this.hpcBase, id, 'outputs');
  }

  public async execStringCommand(
    cmd: string,
    retries = 0,
    retryCount = 0,
  ): Promise<{ stdout: string; stderr: string }> {
    this.logger.debug(`Executing command`);

    return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
      let stdout = '';
      let stderr = '';

      const start = new Date().getTime();
      this.connection.exec(cmd, async (err, stream) => {
        if (err) {
          this.logger.error(err);
          reject(err);
          this.connection.end();
        }
        if (stream) {
          stream
            .on('close', (code: any, signal: any) => {
              this.logger.debug('Stream :: close :: code: ' + code + ', signal: ' + signal);
              resolve({ stdout, stderr });
            })
            .on('data', (data: any) => {
              stdout += data.toString('utf8');
            })
            .stderr.on('data', (data) => {
              stderr += data.toString('utf8');
            });
        } else {
          const elapsed = (new Date().getTime() - start) / 1000.0;
          this.logger.error(`Stream is null in SSH service execStringCommand: ${cmd}. Elapsed time: ${elapsed}`);

          if (retryCount < retries) {
            this.logger.debug(`Retrying SSH connection ${retryCount + 1} of ${retries} ...`);
            await this.retryInit();
            return this.execStringCommand(cmd, retries, retryCount + 1);
          }

          reject('Stream is null');
        }
      });
    });
  }

  private initConnection(): SSHClient {
    const config = this.sshConfig;
    this.logger.debug('Initializing connection');

    const connection = new SSHClient();

    this.addConnectionListeners(connection);
    try {
      const client = connection.connect(config);
      return client;
    } catch (err) {
      this.logger.error(err);
      return connection;
    }
  }

  private async retryInit(): Promise<void> {
    this.logger.log('Retrying SSH connection');
    await setTimeout(() => (this.connection = this.initConnection()), this.getRetryBackoff());
  }

  private addConnectionListeners(connection: SSHClient): SSHClient {
    return connection
      .on('ready', () => {
        this.retry = 1;
        this.logger.debug('Connection ready');
      })

      .on('timeout', async (message: string) => {
        this.logger.error(`Connection timeout: ${message}`);
        connection.removeAllListeners('end');
        connection.removeAllListeners('close');
        connection.destroy();
        await this.retryInit();
      })

      .on('error', async (err) => {
        this.logger.error('Connection Error: ' + err);

        connection.removeAllListeners('end');
        connection.removeAllListeners('close');
        connection.destroy();
        connection.removeAllListeners('error');
        await this.retryInit();
      })

      .on('end', async () => {
        this.logger.error('Connection end');

        connection.removeAllListeners('end');
        connection.removeAllListeners('close');
        connection.destroy();
        await this.retryInit();
      })

      .on('close', async () => {
        this.logger.log('Connection closed');
        connection.removeAllListeners('end');
        connection.removeAllListeners('close');
        connection.destroy();
        await this.retryInit();
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
