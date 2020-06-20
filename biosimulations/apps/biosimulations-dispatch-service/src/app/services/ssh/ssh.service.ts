import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client as SSHClient } from 'ssh2';
import * as fs from 'file-system';
import { SshConnectionConfig } from '../../types/ssh-connection-config/ssh-connection-config';


@Injectable()
export class SshService {

    private hpcConfig = this.configService.get('hpc');

    private sshConfig = this.hpcConfig.ssh as SshConnectionConfig;
    private sftpConfig = this.hpcConfig.sftp as SshConnectionConfig;

    private logger = new Logger(SshService.name);

    constructor(
        private configService: ConfigService
    ){ }

    execStringCommand(cmd: string): Promise<{ stdout: string; stderr: string; }> {
        return new Promise<{ stdout: string; stderr: string; }>((resolve, reject) => {
            const conn = new SSHClient();
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
        
            }).connect(this.sshConfig);
          });
    }

    getFile(localFilePath: string, remoteFilePath: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const conn = new SSHClient();
            conn.on('ready', () => {
              this.logger.log('Connection ready');
              conn.sftp((err, sftp) => {
                if(err){
                    this.logger.error('Unable to open SFTP connection', JSON.stringify(err));
                    reject(err);  
                } 

                sftp.fastGet(remoteFilePath, localFilePath, {}, (downloadError) => {
                    if(downloadError) {
                        this.logger.error('Error occured while downloading file', JSON.stringify(downloadError));
                        reject(downloadError);
                    }
                    this.logger.log('File download successful');
                    resolve(true);
                });
                
              });
        
            }).connect(this.sftpConfig);
          });
    }

    putFile(localFilePath: string, remoteFilePath: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const conn = new SSHClient();
            conn.on('ready', () => {
              this.logger.log('Connection ready');
              conn.sftp((err, sftp) => {
                if(err){
                    this.logger.error('Unable to open SFTP connection', JSON.stringify(err));
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
                    conn.close();
                    
                });
        
                // initiate transfer of file
                readStream.pipe( writeStream );
                
              });
        
            }).connect(this.sftpConfig);
          });
    }

    listFiles(remoteDirPath: string): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            const conn = new SSHClient();
            conn.on('ready', () => {
              this.logger.log('Connection ready');
              conn.sftp((err, sftp) => {
                if(err){
                    this.logger.error('Unable to open SFTP connection', JSON.stringify(err));
                    reject(err);  
                } 

                sftp.readdir(remoteDirPath, (readErr, list) => {
                    if (readErr) {
                        this.logger.error('Cannot read remote directory', JSON.stringify(readErr));
                        reject(readErr);
                    }
                    resolve(list);
                    conn.end();
                    this.logger.log('SFTP connection closed successfully')
                 });
                
              });
        
            }).connect(this.sftpConfig);
          });
    }

    // TODO: Complete 'deleteFile' method
    // @body: https://ourcodeworld.com/articles/read/133/how-to-create-a-sftp-client-with-node-js-ssh2-in-electron-framework
    // deleteFile(remoteFilePath: string): Promise<boolean> {
        
    // }

    // TODO: Complete 'changeFilePermissions' method
    // @body: https://ourcodeworld.com/articles/read/133/how-to-create-a-sftp-client-with-node-js-ssh2-in-electron-framework
    // changeFilePermissions(remoteFilePath: string): Promise<boolean> {

    // }
}
