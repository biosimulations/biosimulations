import { __makeTemplateObject } from 'tslib'

export class Sbatch {
     
    // Template as string

    constructor() {
        // Parse simspec for required params that will be used to generate SBATCH
    }

    static generate(tempSimDir: string, simulator: string, omexName: string): string {
    const template = `#!/bin/bash
    #SBATCH --job-name=test
    #SBATCH --output=${tempSimDir}/out/job.output
    #SBATCH --ntasks=1
    #SBATCH --time=10:00
    #SBATCH --mem-per-cpu=1000
    
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
    
    localSingularityImage="/home/CAM/crbmapi/copasi_latest.img"
    
    command="singularity run -B ${tempSimDir}/in:/root/in -B ${tempSimDir}/out:/root/out /home/CAM/crbmapi/${simulator}.img -i /root/in/${omexName} -o /root/out"
    echo $command
    
    eval $command;`
    return template;
    }
    
}

