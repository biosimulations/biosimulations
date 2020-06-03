import { Injectable, Scope, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SSHConnectionConfig } from '../ssh/ssh';

export class Hpc {
    constructor(sshConfig: SSHConnectionConfig, sftpConfig: SSHConnectionConfig) {
        // Setup class variables in params
        // Establish SSH and SFTP connection with HPC
    }

    dispatchJob(simSpec, omexPath) {
        // get remote InDir and OutDir from config (ideally indir name should be simId)
        
        // Expect omex as file
        // Save omex file locally (so that it can be transferred over SSH session)
        // Call SBATCH generator by passing sim spec
        // Transfer omex and sbatch to inDir on HPC via SFTP session
        // execute SBATCH via SSH session
        // Frequent logging at every step
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
