export type GenerateImageUpdateSbatchOptions = {
  simulator: string;
  simulatorVersion: string;
  singularityPullFolder: any;
  outputFilename: string;
  cpus: any;
  memory: any;
  maxTime: any;
  slurmConstraints: any;
  slurmPartition: any;
  slurmQos: any;
  modulePath: any;
  moduleInitScript: any;
  executablesPath: any;
  singularityModule: any;
  singularityCacheDir: any;
  forceOverwrite: boolean;
  dockerImageUrl: string;
};

export function generateImageUpdateSbatch(data: GenerateImageUpdateSbatchOptions): string {
  return `#!/bin/bash
#SBATCH --job-name=Build-simulator-${data.simulator}-${data.simulatorVersion}
#SBATCH --chdir=${data.singularityPullFolder}
#SBATCH --output=${data.outputFilename}
#SBATCH --ntasks=1
#SBATCH --cpus-per-task=${data.cpus}
#SBATCH --mem=${data.memory}
#SBATCH --time=${data.maxTime}
#SBATCH --constraint=${data.slurmConstraints}
#SBATCH --partition=${data.slurmPartition}
#SBATCH --qos=${data.slurmQos}

# configure error handling
set -e

# load Singularity
export MODULEPATH=${data.modulePath}
source ${data.moduleInitScript}
export ${data.executablesPath}
module load ${data.singularityModule}

# set up Singularity
export SINGULARITY_CACHEDIR=${data.singularityCacheDir}
export SINGULARITY_PULLFOLDER=${data.singularityPullFolder}

# report Singularity version and node
echo "Building image with Singularity '$(singularity --version)' on '$(hostname)' ... "

# build image
singularity -v pull --tmpdir /local ${data.forceOverwrite ? '--force' : ''} ${data.dockerImageUrl}`;
}
