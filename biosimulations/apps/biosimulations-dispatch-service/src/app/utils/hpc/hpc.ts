import { Injectable, Scope, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SSHConnectionConfig, Ssh } from '../ssh/ssh';

export class Hpc {

    sshClient: Ssh = null;
    constructor(public sshConfig: SSHConnectionConfig, public sftpConfig: SSHConnectionConfig) {
        this.sshClient = new Ssh(sshConfig, sftpConfig);
    }

    dispatchJob(simDirBase: string, omexPath: string, sbatchPath: string) {

        const sbatchPathSplit = sbatchPath.split('/');
        const omexPathSplit = omexPath.split('/');
        const sbatchName = sbatchPathSplit[sbatchPathSplit.length - 1];
        const omexName = omexPathSplit[omexPathSplit.length - 1];

        console.log('Omex name: ', omexName)
        
        // get remote InDir and OutDir from config (ideally indir name should be simId)
        this.sshClient.execStringCommand(`mkdir -p ${simDirBase}/in`).then(value => {
                console.log('Simdirectory created on HPC: ', value);


                this.sshClient.putFile(omexPath, `${simDirBase}/in/${omexName}`).then(val => {
                        
                        console.log('Omex copying to HPC successful: ', val);
                        
        
                    }
                ).catch(omexErr => {
                    console.log('Could not copy omex to HPC: ', omexErr);
                });

                this.sshClient.putFile(sbatchPath, `${simDirBase}/in/${sbatchName}`).then(
                    res => {
                        console.log('SBATCH copying to HPC successful: ', res);
                        this.sshClient.execStringCommand(`chmod +x ${simDirBase}/in/${sbatchName}`).then(resp => {
                            console.log('Sbatch made executable: ', resp);

                            this.sshClient.execStringCommand(`${simDirBase}/in/${sbatchName}`).then(result =>{
                                console.log('Execution of sbatch was successful: ', result);
                                }).catch(error => {
                                console.log('Could not execute SBATCH: ', error);
                                });


                        }).catch(err => {
                            console.log('Error occured whiled changing permission: ', err);
                        });
                        
        
                    }
                ).catch(err => {

                    console.log('Could not copy SBATCH to HPC: ', err);
                });
        
                

            }).catch(err => {
                console.log('Error occured while creating simdirectory: ', err);

        });

        this.sshClient.execStringCommand(`mkdir -p ${simDirBase}/out`).then(
            value => {
                console.log('Output directory for simulation created: ', value);

            }).catch(err => {
                console.log('Could not create output directory for simulation: ',err);
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
