import { Injectable } from '@nestjs/common';
import { urls } from '@biosimulations/config/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class SbatchService {
  constructor(private configService: ConfigService) {}
  // Note: Don't indent the template lines starting with "#SBATCH", otherwise SLURM configuration doesn't work
  generateSbatch(
    tempSimDir: string,
    simulator: string,
    omexName: string,
    apiDomain: string,
    simId: string
  ): string {
    const template = `#!/bin/bash
#SBATCH --job-name=BioSimulations_${simId}
#SBATCH --time=10:00
#SBATCH --output=${tempSimDir}/out/job.output
#SBATCH --error=${tempSimDir}/out/job.error
#SBATCH --ntasks=1
#SBATCH --mem-per-cpu=1000
#SBATCH --partition=general
#SBATCH --qos=general\n
export MODULEPATH=/isg/shared/modulefiles:/tgcapps/modulefiles
source /usr/share/Modules/init/bash
module load singularity/3.1.1
date
wget ${apiDomain}run/${simId}/download -O ${tempSimDir}/in/${omexName}
command=\\"singularity run -B ${tempSimDir}/in:/root/in -B ${tempSimDir}/out:/root/out /home/FCAM/crbmapi/nfs/biosimulations/singularity_images/${simulator} -i /root/in/${omexName} -o /root/out\\"
eval \\$command;`;
    return template;
  }
}
