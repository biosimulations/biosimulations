import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariable, Purpose } from '@biosimulations/datamodel/common';

@Injectable()
export class SbatchService {
  public constructor(private configService: ConfigService) {}
  private logger = new Logger(SbatchService.name);
  public generateSbatch(
    tempSimDir: string,
    simulator: string,
    cpus: number,
    memory: number,
    maxTime: number,
    envVars: EnvironmentVariable[],
    purpose: Purpose,
    omexName: string,
    apiDomain: string,
    simId: string,
  ): string {
    const homeDir = this.configService.get('hpc.homeDir');
    const bucket = this.configService.get('storage.bucket');
    let endpoint = this.configService.get('storage.endpoint');

    const memoryFormatted = Math.ceil(memory * 1000);

    let maxTimeMin = Math.floor(maxTime);
    let maxTimeSec = Math.ceil((maxTime % 1) * 60);
    if (maxTimeSec == 60) {
      maxTimeMin++;
      maxTimeSec = 0;
    }
    const maxTimeFormatted = `${maxTimeMin}:${maxTimeSec
      .toString()
      .padStart(2, '0')}`;

    const nc = '\\033[0m';
    const red = '\\033[0;31m';
    const cyan = '\\033[0;36m';

    if (apiDomain.startsWith('http://localhost')) {
      apiDomain = 'https://api.biosimulations.dev/';
    }
    if (endpoint.startsWith('https://localhost')) {
      endpoint = 'http://s3low.scality.uchc.edu';
    }

    let allEnvVars = [...envVars];
    const vars = this.configService.get('singularity').envVars;

    try {
      vars.forEach((envVarPurpose: any): void => {
        if (envVarPurpose.purpose === 'ALL') {
          allEnvVars.push({
            key: envVarPurpose.key,
            value: envVarPurpose.value,
          });
        } else if (
          envVarPurpose.purpose == 'ACADEMIC' &&
          purpose === Purpose.academic
        ) {
          allEnvVars.push({
            key: envVarPurpose.key,
            value: envVarPurpose.value,
          });
        }
      });
    } catch (e) {
      this.logger.error(e);
      allEnvVars = [...envVars];
    }

    const allEnvVarsString =
      allEnvVars.length > 0
        ? '--env ' +
          allEnvVars
            .map((envVar: EnvironmentVariable): string => {
              const key = envVar.key.replace(/([^a-zA-Z0-9,._+@%/-])/, '\\$&');
              const val = envVar.value.replace(
                /([^a-zA-Z0-9,._+@%/-])/,
                '\\$&',
              );
              return `${key}=${val}`;
            })
            .join(',')
        : '';
    // TODO Remove the no check flag
    const template = `#!/bin/bash
#SBATCH --job-name=${simId}_Biosimulations
#SBATCH --time=${maxTimeFormatted}
#SBATCH --output=${tempSimDir}/job.output
#SBATCH --error=${tempSimDir}/job.output
#SBATCH --chdir=${tempSimDir}
#SBATCH --ntasks=1
#SBATCH --partition=crbm
#SBATCH --mem=${memoryFormatted}M
#SBATCH --cpus-per-task=${cpus}
#SBATCH --qos=general\n

export MODULEPATH=/home/FCAM/crbmapi/module/
source /usr/share/Modules/init/bash
export PATH=$PATH:/usr/sbin/
module load singularity/3.7.1-biosim
export SINGULARITY_CACHEDIR=${homeDir}/singularity/cache/
export SINGULARITY_PULLFOLDER=${homeDir}/singularity/images/
cd ${tempSimDir}
echo -e '${cyan}=============Downloading Combine Archive=============${nc}'
( ulimit -f 1048576; srun wget --no-check-certificate --progress=bar:force ${apiDomain}runs/${simId}/download -O '${omexName}')
echo -e '${cyan}=============Extracting Combine Archive==============${nc}'
unzip -o ${omexName} -d contents
echo -e '${cyan}=================Running simulation==================${nc}'
srun singularity run --tmpdir /local --bind ${tempSimDir}:/root "${allEnvVarsString}" ${simulator} -i '/root/${omexName}' -o '/root'
echo -e '${cyan}=============Uploading results to data-service=============${nc}'
srun hsload -v reports.h5 '/results/${simId}'
echo -e '${cyan}=============Creating output archive=============${nc}'
srun zip ${simId}.zip reports.h5 log.yml plots.zip job.output
echo -e '${cyan}=============Uploading outputs to storage=============${nc}'
export PYTHONWARNINGS="ignore"; srun aws --no-verify-ssl --endpoint-url ${endpoint} s3 sync --acl public-read --exclude "*.sbatch" --exclude "*.omex" . s3://${bucket}/simulations/${simId}
echo -e '${cyan}=============Run Complete. Thank you for using BioSimulations!=============${nc}'
`;

    return template;
  }

  public generateImageUpdateSbatch(url: string, force: string): string {
    const homeDir = this.configService.get('hpc.homeDir');
    const image = url
      .split('docker://ghcr.io/biosimulators/')[1]
      .replace(':', '_');

    const template = `#!/bin/bash
#SBATCH --job-name=${image}-Build
#SBATCH --time=90:00
#SBATCH --chdir=${homeDir}/singularity/images/
#SBATCH --partition=crbm
#SBATCH --qos=general
#SBATCH --ntasks=1
#SBATCH --output=${homeDir}/singularity/images/${image}.output
#SBATCH --cpus-per-task=8
#SBATCH --mem=16G

export MODULEPATH=/home/FCAM/crbmapi/module/
source /usr/share/Modules/init/bash
export PATH=$PATH:/usr/sbin/
module load singularity/3.7.1-biosim
export SINGULARITY_CACHEDIR=${homeDir}/singularity/cache/
export SINGULARITY_PULLFOLDER=${homeDir}/singularity/images/
echo "Building On:"
hostname
echo "Using Singularity"
singularity --version
singularity -v pull --tmpdir /local ${force} ${url}`;
    return template;
  }
}
