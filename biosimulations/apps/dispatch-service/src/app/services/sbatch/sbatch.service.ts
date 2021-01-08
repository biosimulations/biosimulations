import { Injectable } from '@nestjs/common';
import { urls } from '@biosimulations/config/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SbatchService {
  constructor(private configService: ConfigService) { }
  // Note: Don't indent the template lines starting with "#SBATCH", otherwise SLURM configuration doesn't work
  generateSbatch(
    tempSimDir: string,
    simulator: string,
    apiDomain: string,
    simId: string
  ): string {

    const homeDir = this.configService.get("hpc.homeDir")
    const template = `#!/bin/bash    
#SBATCH --job-name=BioSimulations_${simId}
#SBATCH --time=20:00
#SBATCH --output=${tempSimDir}/out/job.output
#SBATCH --error=${tempSimDir}/out/job.error
#SBATCH --ntasks=1
#SBATCH --mem-per-cpu=1000
#SBATCH --partition=crbm
#SBATCH --qos=general\n
export MODULEPATH=/isg/shared/modulefiles:/tgcapps/modulefiles
source /usr/share/Modules/init/bash
module load singularity/3.1.1
export XDG_RUNTIME_DIR=${homeDir}/singularityXDG/
date
\`wget ${apiDomain}run/${simId}/download -O "${tempSimDir}/in/project.omex" 1>"${tempSimDir}/out/job.output" 2>&1\`
command=\\" singularity pull --force ${simulator} && singularity run -B ${tempSimDir}/in:/root/in -B ${tempSimDir}/out:/root/out ${simulator} -i '/root/in/project.omex' -o /root/out\\"
eval \\$command;`;
    console.log(template)
    return template;
  }
}
