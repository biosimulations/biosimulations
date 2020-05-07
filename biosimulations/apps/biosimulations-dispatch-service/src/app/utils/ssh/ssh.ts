import { Logger } from '@nestjs/common';
import { Client } from 'ssh2';

export class Ssh {
    private logger = new Logger(Ssh.name);
    private host = null;
    private port = null;
    private username = null;
    private password = null;

    constructor(host: string, port: number, username: string, password: string) {
        this.host = host;
        this.port = port;
        this.username = username;
        this.password = password;
    }

    stringCommand(cmd: string): Promise<{ stdout: string; stderr: string; }> {
        return new Promise<{ stdout: string; stderr: string; }>((resolve, reject) => {
            const conn = new Client();
            conn.on('ready', () => {
              this.logger.log('Connection ready');
              let stdout = '';
              let stderr = '';
              conn.exec(cmd, (err, stream) => {
                if(err){
                    reject(err);  
                } 
                stream.on('close', (code, signal) => {
                  resolve({ stdout, stderr });
                  conn.end();
                  this.logger.log('Connection closed')
                }).on('data', (data) => {
                  stdout += data.toString('utf8');
                }).stderr.on('data', (data) => {
                  stderr += data.toString('utf8');
                });
              });
        
            }).connect({ host: this.host, port: this.port, username: this.username, password: this.password });
          });
    }
}