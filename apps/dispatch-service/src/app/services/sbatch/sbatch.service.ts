import { Injectable, Logger } from '@nestjs/common';
import { Endpoints } from '@biosimulations/config/common';
import { ConfigService } from '@nestjs/config';
import {
  EnvironmentVariable,
  Purpose,
  ConsoleFormatting,
} from '@biosimulations/datamodel/common';

@Injectable()
export class SbatchService {
  private endpoints: Endpoints;

  public constructor(private configService: ConfigService) {
    const env = this.configService.get('server.env');
    this.endpoints = new Endpoints(env);
  }

  private logger = new Logger(SbatchService.name);

  /** Generate a SLURM script to execute a COMBINE/OMEX archive
   * @param runId id of the simulation run
   * @param simulator BioSimulators id of the simulation tool (e.g., `tellurium`)
   * @param simulatorVersion version of the simulation tool (e.g., `2.2.1`)
   * @param cpus number of CPUs to request
   * @param memory amount of memory to request in GB
   * @param maxTime maximum amount of wall time to request in minutes
   * @param envVars values of environment variables to use to run the job
   * @param purpose purpose of the simulation run (e.g., academic research)
   * @param combineArchiveFilename filename of the COMBINE/OMEX archive to execute
   * @param workDirname absolute path to a directory which should be used as the working directory
   *        for exeucting the COMBINE/OMEX archive, including where outputs should be saved
   */
  public generateSbatch(
    runId: string,
    simulator: string,
    simulatorVersion: string,
    cpus: number,
    memory: number,
    maxTime: number,
    envVars: EnvironmentVariable[],
    purpose: Purpose,
    combineArchiveFilename: string,
    workDirname: string,
  ): string {
    const homeDir = this.configService.get('hpc.homeDir');
    const bucket = this.configService.get('storage.bucket');
    let endpoint = this.configService.get('storage.endpoint');

    const simulatorImage = `docker://ghcr.io/biosimulators/${simulator}:${simulatorVersion}`;

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

    const nc = ConsoleFormatting.noColor;
    const cyan = ConsoleFormatting.cyan;

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
    const runCombineArchiveUrl = this.endpoints.getRunDownloadEndpoint(
      runId,
      true,
    );
    const simulationRunS3Path = this.endpoints.getSimulationRunS3Path(runId);
    const simulationRunContentS3Subpath =
      this.endpoints.getSimulationRunContentS3Subpath();
    const simulationRunResultsHsdsPath =
      this.endpoints.getSimulationRunResultsHsdsPath(runId);
    const outputArchiveS3Subpath = this.endpoints.getSimulationRunOutputS3Path(
      runId,
      false,
    );

    // TODO Remove the no check flag
    const template = `#!/bin/bash
#SBATCH --job-name=${runId}_Biosimulations
#SBATCH --time=${maxTimeFormatted}
#SBATCH --output=${workDirname}/job.output
#SBATCH --error=${workDirname}/job.output
#SBATCH --chdir=${workDirname}
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
cd ${workDirname}
echo -e '${cyan}Thank you for using runBioSimulations!${nc}'
echo -e ''
echo -e '${cyan}============================================ Downloading COMBINE archive ============================================${nc}'
( ulimit -f 1048576; srun curl -L -o '${combineArchiveFilename}' ${runCombineArchiveUrl})
echo -e ''
echo -e '${cyan}============================================= Extracting COMBINE archive ============================================${nc}'
unzip -o '${combineArchiveFilename}' -d '${simulationRunContentS3Subpath}'
echo -e ''
echo -e '${cyan}============================================= Executing COMBINE archive =============================================${nc}'
srun singularity run --tmpdir /local --bind ${workDirname}:/root "${allEnvVarsString}" ${simulatorImage} -i '/root/${combineArchiveFilename}' -o '/root'
echo -e ''
echo -e '${cyan}=================================================== Saving results ==================================================${nc}'
srun hsload -v reports.h5 '${simulationRunResultsHsdsPath}'
echo -e ''
echo -e '${cyan}================================================== Zipping outputs ==================================================${nc}'
srun zip '${outputArchiveS3Subpath}' reports.h5 log.yml plots.zip job.output
echo -e ''
echo -e '${cyan}=================================================== Saving outputs ==================================================${nc}'
export PYTHONWARNINGS="ignore"; srun aws --no-verify-ssl --endpoint-url ${endpoint} s3 sync --acl public-read --exclude "*.sbatch" --exclude "*.omex" . 's3://${bucket}/${simulationRunS3Path}'
`;

    return template;
  }

  /** Generate SLURM script to pull a Docker image and convert it to a Singularity image
   * @param dockerImageUrl URL for the Docker image
   * @param forceOverwrite whether to overwrite an existing Singularity image file, if it exists
   */
  public generateImageUpdateSbatch(dockerImageUrl: string, forceOverwrite: boolean): string {
    const homeDir = this.configService.get('hpc.homeDir');
    const singularityImageName = dockerImageUrl
      .split('docker://ghcr.io/biosimulators/')[1]
      .replace(':', '_');

    const template = `#!/bin/bash
#SBATCH --job-name=${singularityImageName}-Build
#SBATCH --time=90:00
#SBATCH --chdir=${homeDir}/singularity/images/
#SBATCH --partition=crbm
#SBATCH --qos=general
#SBATCH --ntasks=1
#SBATCH --output=${homeDir}/singularity/images/${singularityImageName}.output
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
singularity -v pull --tmpdir /local ${forceOverwrite ? '--force' : ''} ${dockerImageUrl}`;
    return template;
  }
}
