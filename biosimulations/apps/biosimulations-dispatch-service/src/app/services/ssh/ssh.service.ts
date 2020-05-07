import { Injectable, Logger } from '@nestjs/common';
import { Client } from 'ssh2';

@Injectable()
export class SshService {
    private logger = new Logger(SshService.name);
    constructor() {
        
    }

    stringCommand(cmd: string): Promise<{ stdout: string; stderr: string; }> {
        return new Promise<{ stdout: string; stderr: string; }>((resolve, reject) => {
            const conn = new Client();
            conn.on('ready', () => {
              let stdout = '';
              let stderr = '';
              conn.exec(cmd, (err, stream) => {
                if(err){
                    reject(err);  
                } 
                stream.on('close', (code, signal) => {
                  resolve({ stdout, stderr });
                  conn.end();
                }).on('data', (data) => {
                  stdout += data.toString('utf8');
                }).stderr.on('data', (data) => {
                  stderr += data.toString('utf8');
                });
              });
        
            }).connect({ host: '127.0.0.1', port: 22, username: 'user', password: 'pass' });
          });
    }
}
