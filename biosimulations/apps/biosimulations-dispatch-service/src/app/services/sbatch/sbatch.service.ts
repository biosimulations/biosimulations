import { Injectable } from '@nestjs/common';

@Injectable()
export class SbatchService {
    // Note: Don't indent the template lines starting with "#SBATCH", otherwise SLURM configuration doesn't work
    generateSbatch(tempSimDir: string, simulator: string, omexName: string): string {
        const template = `#!/bin/bash
#SBATCH --job-name=test
#SBATCH --output=${tempSimDir}/out/job.output
#SBATCH --ntasks=1
#SBATCH --time=10:00
#SBATCH --mem-per-cpu=1000
#SBATCH --partition=special
#SBATCH --qos=special
        
        echo "Job ID: $SLURM_JOB_ID running on"
        echo "Job Owner: $SLURM_JOB_UID "
        
        export MODULEPATH=/isg/shared/modulefiles:/tgcapps/modulefiles
        
        source /usr/share/Modules/init/bash
        
        module load singularity/3.1.1
        
        TMPDIR=${tempSimDir}/out
        echo "using TMPDIR=$TMPDIR"
        if [ ! -e $TMPDIR ]; then mkdir -p $TMPDIR ; fi
        
        echo "job running on host \`hostname -f\`"
        
        echo "id is $SLURM_JOB_ID"
        
        echo "bash version is \`bash --version\`"
        date
        
        echo ENVIRONMENT
        env
        
        command="singularity run -B ${tempSimDir}/in:/root/in -B ${tempSimDir}/out:/root/out /home/FCAM/crbmapi/nfs/k8sdata/singularity_images/${simulator}.img -i /root/in/${omexName} -o /root/out"
        echo $command
        
        eval $command;`
        return template;
        }
}
