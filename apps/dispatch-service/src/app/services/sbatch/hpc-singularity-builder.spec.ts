import { generateImageUpdateSbatch } from './hpc-singularity-builder';

const data = {
  simulator: 'tellurium',
  simulatorVersion: '1.0.0',
  singularityPullFolder: '/tmp/singularity-pull',
  outputFilename: 'tellurim-1.0.0.sbatch',
  cpus: 1,
  memory: '1G',
  maxTime: '1:00:00',
  slurmConstraints: 'simulations&SSE4',
  slurmPartition: 'global',
  slurmQos: 'simulations',
  modulePath: '/tmp/modulepath',
  moduleInitScript: '/tmp/moduleinitscript',
  executablesPath: '/tmp/executablespath',
  singularityModule: 'singularity',
  singularityCacheDir: '/tmp/singularitycachedir',
  forceOverwrite: false,
  dockerImageUrl: 'ghcr.io/biosimulations/tellurium:1.0.0',
};
describe('hpcSingularityBuilder', () => {
  const expected = `#!/bin/bash
#SBATCH --job-name=Build-simulator-tellurium-1.0.0
#SBATCH --chdir=/tmp/singularity-pull
#SBATCH --output=tellurim-1.0.0.sbatch
#SBATCH --ntasks=1
#SBATCH --cpus-per-task=1
#SBATCH --mem=1G
#SBATCH --time=1:00:00
#SBATCH --constraint=simulations&SSE4
#SBATCH --partition=global
#SBATCH --qos=simulations

# configure error handling
set -e

# load Singularity
export MODULEPATH=/tmp/modulepath
source /tmp/moduleinitscript
export /tmp/executablespath
module load singularity

# set up Singularity
export SINGULARITY_CACHEDIR=/tmp/singularitycachedir
export SINGULARITY_PULLFOLDER=/tmp/singularity-pull

# report Singularity version and node
echo "Building image with Singularity '$(singularity --version)' on '$(hostname)' ... "

# build image
singularity -v pull --tmpdir /local  ghcr.io/biosimulations/tellurium:1.0.0`;

  const expectedOverwrite = `#!/bin/bash
#SBATCH --job-name=Build-simulator-tellurium-1.0.0
#SBATCH --chdir=/tmp/singularity-pull
#SBATCH --output=tellurim-1.0.0.sbatch
#SBATCH --ntasks=1
#SBATCH --cpus-per-task=1
#SBATCH --mem=1G
#SBATCH --time=1:00:00
#SBATCH --constraint=simulations&SSE4
#SBATCH --partition=global
#SBATCH --qos=simulations

# configure error handling
set -e

# load Singularity
export MODULEPATH=/tmp/modulepath
source /tmp/moduleinitscript
export /tmp/executablespath
module load singularity

# set up Singularity
export SINGULARITY_CACHEDIR=/tmp/singularitycachedir
export SINGULARITY_PULLFOLDER=/tmp/singularity-pull

# report Singularity version and node
echo "Building image with Singularity '$(singularity --version)' on '$(hostname)' ... "

# build image
singularity -v pull --tmpdir /local --force ghcr.io/biosimulations/tellurium:1.0.0`;
  it('should generate sbatch', () => {
    expect(generateImageUpdateSbatch(data)).toEqual(expected);
  });

  it('should overwrite singularity image if ForceOverwrite is true', () => {
    const dataOverwrite = { ...data, forceOverwrite: true };
    expect(generateImageUpdateSbatch(dataOverwrite)).toEqual(expectedOverwrite);
  });
});
