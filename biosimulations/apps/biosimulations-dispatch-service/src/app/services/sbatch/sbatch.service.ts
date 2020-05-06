import { Injectable } from '@nestjs/common';

@Injectable()
export class SbatchService {
     
    // Template as string
    private template = '';

    constructor(simSpec) {
        // Parse simspec for required params that will be used to generate SBATCH
    }

    generate() {
        // fill out member variables in sbatch template
        // Return the sbatch as string
    }
}
