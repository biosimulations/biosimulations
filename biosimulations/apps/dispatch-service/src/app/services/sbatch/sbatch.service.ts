import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SbatchService {
  constructor(private configService: ConfigService) {}

  public generateSbatch(
    tempSimDir: string,
    simulator: string,
    omexName: string,
    apiDomain: string,
    simId: string,
  ): string {
    const homeDir = this.configService.get('hpc.homeDir');
    if (apiDomain.startsWith('http://localhost')) {
      apiDomain = 'https://run.api.biosimulations.dev/';
    }
    const template = `#!/bin/bash    
#SBATCH --job-name=${simId}_Biosimulations
#SBATCH --time=20:00
#SBATCH --output=${tempSimDir}/out/job.output
#SBATCH --error=${tempSimDir}/out/job.output
#SBATCH --chdir=${tempSimDir}
#SBATCH --ntasks=1
#SBATCH --mem-per-cpu=1000
#SBATCH --partition=crbm
#SBATCH --qos=general\n

export MODULEPATH=/isg/shared/modulefiles:/tgcapps/modulefiles
source /usr/share/Modules/init/bash
module load singularity
export XDG_RUNTIME_DIR=${homeDir}/singularity/XDG/
export SINGULARITY_CACHEDIR=${homeDir}/singularity/cache/
export SINGULARITY_LOCALCACHEDIR=${homeDir}/singularity/localCache/
export SINGULARITY_TMPDIR=${homeDir}/singularity/tmp/
export SINGULARITY_PULLFOLDER=${homeDir}/singularity/images/
wget ${apiDomain}run/${simId}/download -O '${tempSimDir}/in/${omexName}' 1>'${tempSimDir}/out/job.output' 2>&1
singularity -v run -B ${tempSimDir}/in:/root/in -B ${tempSimDir}/out:/root/out ${simulator} -i '/root/in/${omexName}' -o '/root/out'`;
    return template;
  }

  public generateImageUpdateSbatch(url: string, force: string): string {
    const homeDir = this.configService.get('hpc.homeDir');
    const template = `#!/bin/bash    
#SBATCH --job-name=BioSimulations_Image_Update
#SBATCH --time=10:00
#SBATCH --output=${homeDir}/singularityImages/job.output
#SBATCH --ntasks=1
#SBATCH --mem-per-cpu=1000
#SBATCH --partition=crbm
#SBATCH --qos=general\n

export MODULEPATH=/isg/shared/modulefiles:/tgcapps/modulefiles
source /usr/share/Modules/init/bash
module load singularity
export XDG_RUNTIME_DIR=${homeDir}/singularity/XDG/
export SINGULARITY_CACHEDIR=${homeDir}/singularity/cache/
export SINGULARITY_LOCALCACHEDIR=${homeDir}/singularity/localCache/
export SINGULARITY_TMPDIR=${homeDir}/singularity/tmp/
export SINGULARITY_PULLFOLDER=${homeDir}/singularity/images/
command=\\"cd singularityImages && singularity pull ${force} ${url}\\"
    eval \\$command; `;
    return template;
  }
}
