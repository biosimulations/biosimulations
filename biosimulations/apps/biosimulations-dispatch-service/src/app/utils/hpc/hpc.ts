import { Injectable, Scope, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SSHConnectionConfig, Ssh } from '../ssh/ssh';

export class Hpc {

    sshClient: Ssh = null;
    constructor(public sshConfig: SSHConnectionConfig, public sftpConfig: SSHConnectionConfig) {
        this.sshClient = new Ssh(sshConfig, sftpConfig);
    }

    dispatchJob(simDirBase: string, omexPath: string, sbatchPath: string) {

        const sbatchName = sbatchPath.split('/')[-1];
        const omexName = omexPath.split('/')[-1];
        
        // get remote InDir and OutDir from config (ideally indir name should be simId)
        this.sshClient.execStringCommand(`mkdir -p ${simDirBase}/in`).then(
            value => {

                this.sshClient.putFile(omexPath, `${simDirBase}/in/${omexName}`).then(
                    val => {
                        this.sshClient.putFile(sbatchPath, `${simDirBase}/in/${sbatchName}`).then(
                            res => {

                                this.sshClient.execStringCommand(`${simDirBase}/in/${sbatchName}`).then(result =>{

                                }).catch(error => {

                                });
                
                            }
                        ).catch(err => {
                
                        });
        
                    }
                ).catch(err => {
        
                });
        
                

            }).catch(err => {

        });

        this.sshClient.execStringCommand(`mkdir -p ${simDirBase}/out`).then(
            value => {

            }).catch(err => {

        });

    
    }

    getOutputFiles(simId) {
        // pack all files (zip)
        // Get them on local
        // Unpack them and save to mongo
    }

    getRealtimeOutput(simId) {
        // Create a socket via SSH and stream the output file
    }

}
