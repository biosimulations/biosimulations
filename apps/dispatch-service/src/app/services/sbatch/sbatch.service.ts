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

  /** Generate a Slurm script to execute a COMBINE/OMEX archive
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
    const executablesPath = this.configService.get('hpc.executablesPath');

    const modulePath = this.configService.get('hpc.module.path');
    const moduleInitScript = this.configService.get('hpc.module.initScript');

    const slurmPartition = this.configService.get('hpc.slurm.partition');
    const slurmQos = this.configService.get('hpc.slurm.qos');

    const singularityModule = this.configService.get('hpc.singularity.module');
    const singularityCacheDir = this.configService.get(
      'hpc.singularity.cacheDir',
    );
    const singularityPullFolder = this.configService.get(
      'hpc.singularity.pullFolder',
    );

    const storageBucket = this.configService.get('storage.bucket');
    const storageEndpoint = this.configService.get('storage.externalEndpoint');

    const hsdsBasePath = this.configService.get('data.externalBasePath');
    const hsdsUsername = this.configService.get('data.username');
    const hsdsPassword = this.configService.get('data.password');

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
      true,
      runId,
    );
    const simulationRunS3Path = this.endpoints.getSimulationRunS3Path(runId);
    const simulationRunResultsHsdsPath =
      this.endpoints.getSimulationRunResultsHsdsPath(runId);
    const outputArchiveS3Subpath = this.endpoints.getSimulationRunOutputS3Path(
      runId,
      false,
    );

    const template = `#!/bin/bash
#SBATCH --job-name=Simulation-run-${runId}
#SBATCH --time=${maxTimeFormatted}
#SBATCH --output=${workDirname}/job.output
#SBATCH --error=${workDirname}/job.output
#SBATCH --chdir=${workDirname}
#SBATCH --ntasks=1
#SBATCH --partition=${slurmPartition}
#SBATCH --mem=${memoryFormatted}M
#SBATCH --cpus-per-task=${cpus}
#SBATCH --qos=${slurmQos}\n

export MODULEPATH=${modulePath}
source ${moduleInitScript}
export ${executablesPath}
module load ${singularityModule}
export SINGULARITY_CACHEDIR=${singularityCacheDir}
export SINGULARITY_PULLFOLDER=${singularityPullFolder}
cd ${workDirname}
echo -e '${cyan}Thank you for using runBioSimulations!${nc}'

set -e

echo -e ''
echo -e '${cyan}============================================ Downloading COMBINE archive ============================================${nc}'
(ulimit -f 1048576; srun --job-name="Download-project" curl -L -o '${combineArchiveFilename}' ${runCombineArchiveUrl})

echo -e ''
echo -e '${cyan}============================================= Executing COMBINE archive =============================================${nc}'
srun --job-name="Execute-project" singularity run --tmpdir /local --bind ${workDirname}:/root "${allEnvVarsString}" ${simulatorImage} -i '/root/${combineArchiveFilename}' -o '/root'

set +e

echo -e ''
echo -e '${cyan}=================================================== Saving results ==================================================${nc}'
srun --job-name="Save-outputs-to-HSDS" hsload --endpoint ${hsdsBasePath} --username ${hsdsUsername} --password ${hsdsPassword} --verbose reports.h5 '${simulationRunResultsHsdsPath}'

set -e

echo -e ''
echo -e '${cyan}================================================== Zipping outputs ==================================================${nc}'
srun --job-name="Zip-outputs" zip '${outputArchiveS3Subpath}' reports.h5 log.yml plots.zip job.output

echo -e ''
echo -e '${cyan}=================================================== Saving outputs ==================================================${nc}'
export PYTHONWARNINGS="ignore"; srun --job-name="Save-outputs-to-S3" aws --no-verify-ssl --endpoint-url ${storageEndpoint} s3 sync --acl public-read --exclude "*.sbatch" --exclude "*.omex" . 's3://${storageBucket}/${simulationRunS3Path}'
`;

    return template;
  }

  /** Generate Slurm script to pull a Docker image and convert it to a Singularity image
   * @param simulator id of the simulator
   * @param simulatorVersion version of the simulator
   * @param dockerImageUrl URL for the Docker image
   * @param forceOverwrite whether to overwrite an existing Singularity image file, if it exists
   */
  public generateImageUpdateSbatch(
    simulator: string,
    simulatorVersion: string,
    dockerImageUrl: string,
    forceOverwrite: boolean,
  ): string {
    const executablesPath = this.configService.get('hpc.executablesPath');

    const modulePath = this.configService.get('hpc.module.path');
    const moduleInitScript = this.configService.get('hpc.module.initScript');

    const slurmPartition = this.configService.get('hpc.slurm.partition');
    const slurmQos = this.configService.get('hpc.slurm.qos');

    const singularityModule = this.configService.get('hpc.singularity.module');
    const singularityCacheDir = this.configService.get(
      'hpc.singularity.cacheDir',
    );
    const singularityPullFolder = this.configService.get(
      'hpc.singularity.pullFolder',
    );

    const singularityImageName = dockerImageUrl
      .split('docker://ghcr.io/biosimulators/')[1]
      .replace(':', '_');

    const maxTime = this.configService.get('hpc.buildSingularityImage.maxTime');
    const cpus = this.configService.get('hpc.buildSingularityImage.cpus');
    const memory = this.configService.get('hpc.buildSingularityImage.memory');

    const template = `#!/bin/bash
#SBATCH --job-name=Build-simulator-${simulator}-${simulatorVersion}
#SBATCH --time=${maxTime}
#SBATCH --chdir=${singularityPullFolder}
#SBATCH --partition=${slurmPartition}
#SBATCH --qos=${slurmQos}
#SBATCH --ntasks=1
#SBATCH --output=${singularityPullFolder}/${singularityImageName}.output
#SBATCH --cpus-per-task=${cpus}
#SBATCH --mem=${memory}

export MODULEPATH=${modulePath}
source ${moduleInitScript}
export ${executablesPath}
module load ${singularityModule}
export SINGULARITY_CACHEDIR=${singularityCacheDir}
export SINGULARITY_PULLFOLDER=${singularityPullFolder}
echo "Building On:"
hostname
echo "Using Singularity"
singularity --version
singularity -v pull --tmpdir /local ${
      forceOverwrite ? '--force' : ''
    } ${dockerImageUrl}`;
    return template;
  }
}
