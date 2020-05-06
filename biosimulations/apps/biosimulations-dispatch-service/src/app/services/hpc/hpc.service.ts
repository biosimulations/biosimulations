import { Injectable } from '@nestjs/common';

@Injectable()
export class HpcService {
    constructor(username,password, server, sftp_server) {
        // Setup class variables in params
        // Establish SSH and SFTP connection with HPC
    }

    dispatchJob(simSpec, omex) {
        // get remote InDir and OutDir from config (ideally indir name should be simId)
        // Expect omex as file
        // Save omex file locally (so that it can be transferred over SSH session)
        // Call SBATCH generator by passing sim spec
        // Transfer omex and sbatch to inDir on HPC via SFTP session
        // execute SBATCH via SSH session
        // Frequent logging at every step
    }

    getOutput(simId) {
        // pack all files (zip)
        // Get them on local
        // Unpack them and save to mongo
    }
}
