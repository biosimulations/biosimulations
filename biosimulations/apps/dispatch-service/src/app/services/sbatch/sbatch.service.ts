import { Injectable } from '@nestjs/common';

@Injectable()
export class SbatchService {
  // Note: Don't indent the template lines starting with "#SBATCH", otherwise SLURM configuration doesn't work
  generateSbatch(
    tempSimDir: string,
    simulator: string,
    omexName: string
  ): string {
    const template = `#!/bin/bash
#SBATCH --job-name=test
#SBATCH --output=${tempSimDir}/out/job.output
#SBATCH --error=${tempSimDir}/out/job.error
#SBATCH --ntasks=1
#SBATCH --time=10:00
#SBATCH --mem-per-cpu=1000
#SBATCH --partition=general
#SBATCH --qos=general
        export MODULEPATH=/isg/shared/modulefiles:/tgcapps/modulefiles
        source /usr/share/Modules/init/bash
        module load singularity/3.1.1
        TMPDIR=${tempSimDir}/out
        if [ ! -e $TMPDIR ]; then mkdir -p $TMPDIR ; fi
        date
        command="singularity run -B ${tempSimDir}/in:/root/in -B ${tempSimDir}/out:/root/out /home/FCAM/crbmapi/nfs/biosimulations/singularity_images/${simulator}.img -i /root/in/${omexName} -o /root/out"
        eval $command;`;
    return template;
  }
}
