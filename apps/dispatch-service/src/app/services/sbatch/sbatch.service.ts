import { Injectable, Logger } from '@nestjs/common';
import { Endpoints } from '@biosimulations/config/common';
import { FilePaths, OutputFileName } from '@biosimulations/shared/storage';
import { DataPaths } from '@biosimulations/hsds/client';
import { ConfigService } from '@nestjs/config';
import { generateImageUpdateSbatch } from '@biosimulations/hpc/singularityBuilder';
import { EnvironmentVariable, Purpose, ConsoleFormatting } from '@biosimulations/datamodel/common';

@Injectable()
export class SbatchService {
  private endpoints: Endpoints;

  private dataPaths: DataPaths;
  private logger = new Logger(SbatchService.name);
  public constructor(private configService: ConfigService, private filePaths: FilePaths) {
    const env = this.configService.get('server.env');
    this.endpoints = new Endpoints(env);
    this.dataPaths = new DataPaths();
  }

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
  public generateRunSimulationSbatch(
    runId: string,
    simulator: string,
    simulatorVersion: string,
    cpus: number,
    memory: number,
    maxTime: number,
    envVars: EnvironmentVariable[],
    purpose: Purpose,
    workDirname: string,
  ): string {
    const combineArchiveFilename = 'archive.omex';
    const executablesPath = this.configService.get('hpc.executablesPath');

    const modulePath = this.configService.get('hpc.module.path');
    const moduleInitScript = this.configService.get('hpc.module.initScript');

    const slurmConstraints = this.configService.get('hpc.slurm.constraints') || '';
    const slurmPartition = this.configService.get('hpc.slurm.partition');
    const slurmQos = this.configService.get('hpc.slurm.qos');

    const singularityModule = this.configService.get('hpc.singularity.module');
    const singularityCacheDir = this.configService.get('hpc.singularity.cacheDir');
    const singularityPullFolder = this.configService.get('hpc.singularity.pullFolder');

    const storageBucket = this.configService.get('storage.bucket');
    const storageEndpoint = this.configService.get('storage.endpoint');
    const storageKey = this.configService.get('storage.accessKey');
    const storageSecret = this.configService.get('storage.secret');

    const hsdsBasePath = this.configService.get('data.externalBasePath');
    const hsdsUsername = this.configService.get('data.username');
    const hsdsPassword = this.configService.get('data.password');
    const hsdsRetries = 10;

    const simulatorImage = `docker://ghcr.io/biosimulators/${simulator}:${simulatorVersion}`;

    const memoryFormatted = Math.ceil(memory * 1000);

    let maxTimeMin = Math.floor(maxTime);
    let maxTimeSec = Math.ceil((maxTime % 1) * 60);
    if (maxTimeSec == 60) {
      maxTimeMin++;
      maxTimeSec = 0;
    }
    const maxTimeFormatted = `${maxTimeMin}:${maxTimeSec.toString().padStart(2, '0')}`;

    const nc = ConsoleFormatting.noColor;
    const cyan = ConsoleFormatting.cyan;

    let allEnvVars = [...envVars];

    allEnvVars.push({
      key: 'HPC',
      value: '1',
    });
    allEnvVars.push({
      key: 'CPUS',
      value: cpus.toString(),
    });

    const vars = this.configService.get('singularity').envVars;
    try {
      vars.forEach((envVarPurpose: any): void => {
        if (envVarPurpose.purpose === 'ALL') {
          allEnvVars.push({
            key: envVarPurpose.key,
            value: envVarPurpose.value,
          });
        } else if (envVarPurpose.purpose == 'ACADEMIC' && purpose === Purpose.academic) {
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
        ? '--env "' +
          allEnvVars
            .map((envVar: EnvironmentVariable): string => {
              const key = envVar.key.replace(/([^a-zA-Z0-9,._+@%/-])/, '\\$&');
              const val = envVar.value.replace(/([^a-zA-Z0-9,._+@%/-])/, '\\$&');
              return `${key}=${val}`;
            })
            .join(',') +
          '"'
        : '';
    // Need to get external endpoint so that HPC can download the archive
    const runCombineArchiveUrl = this.endpoints.getSimulationRunDownloadEndpoint(true, runId);
    const simulationRunS3Path = this.filePaths.getSimulationRunPath(runId);
    const simulationRunResultsHsdsPath = this.dataPaths.getSimulationRunResultsPath(runId);

    const outputsS3Subpath = this.filePaths.getSimulationRunOutputsPath(runId, false);

    const outputRawLogSubPath = this.filePaths.getSimulationRunOutputFilePath(runId, OutputFileName.RAW_LOG, false);
    const outputsReportsFileSubPath = this.filePaths.getSimulationRunOutputFilePath(
      runId,
      OutputFileName.REPORTS,
      false,
    );
    const outputsPlotsFileSubPath = this.filePaths.getSimulationRunOutputFilePath(runId, OutputFileName.PLOTS, false);

    const combineArchiveContentsDirname = this.filePaths.getSimulationRunContentFilePath(
      runId,
      undefined,
      undefined,
      false,
    );

    const template = `#!/bin/bash
#SBATCH --job-name=Simulation-run-${runId}
#SBATCH --chdir=${workDirname}
#SBATCH --output=${workDirname}/${OutputFileName.RAW_LOG}
#SBATCH --error=${workDirname}/${OutputFileName.RAW_LOG}
#SBATCH --ntasks=1
#SBATCH --cpus-per-task=${cpus}
#SBATCH --mem=${memoryFormatted}M
#SBATCH --time=${maxTimeFormatted}
#SBATCH --constraint=${slurmConstraints}
#SBATCH --partition=${slurmPartition}
#SBATCH --qos=${slurmQos}

# configure error handling
set -e

# print thank you message
echo -e '${cyan}Thank you for using runBioSimulations!${nc}'

echo -e ''
echo -e '${cyan}================================================ Loading Singularity ================================================${nc}'
export MODULEPATH=${modulePath}
source ${moduleInitScript}
export ${executablesPath}
module load ${singularityModule}
export SINGULARITY_CACHEDIR=${singularityCacheDir}
export SINGULARITY_PULLFOLDER=${singularityPullFolder}

echo -e ''
echo -e '${cyan}=================================================== Set up storage ==================================================${nc}'
export PYTHONWARNINGS="ignore"
export AWS_ACCESS_KEY_ID=${storageKey}
export AWS_SECRET_ACCESS_KEY=${storageSecret}

echo -e ''
echo -e '${cyan}========================================== Downloading COMBINE/OMEX archive =========================================${nc}'
(ulimit -f 1048576; srun --job-name="Download-project" curl -L -o '${combineArchiveFilename}' ${runCombineArchiveUrl})

echo -e ''
echo -e '${cyan}=========================================== Executing COMBINE/OMEX archive ==========================================${nc}'
TEMP_DIRNAME=$(mktemp --directory --tmpdir=/local)
set +e

srun --job-name="Execute-project" \
  singularity run \
    --bind ${workDirname}:/root \
    --bind \${TEMP_DIRNAME}:/tmp \
    ${allEnvVarsString} \
    ${simulatorImage} \
      -i '/root/${combineArchiveFilename}' \
      -o '/root/${outputsS3Subpath}'

rm -rf \${TEMP_DIRNAME}

echo -e ''
echo -e '${cyan}===================================================== Saving log ====================================================${nc}'

srun --job-name="Save-raw-log-to-S3-1" \
  aws \
    --endpoint-url ${storageEndpoint} \
    s3 sync \
      . \
      's3://${storageBucket}/${simulationRunS3Path}' \
      --exclude '*' \
      --include '${OutputFileName.RAW_LOG}' \
      --acl public-read

srun --job-name="Save-structured-log-to-S3" \
  aws \
    --endpoint-url ${storageEndpoint} \
    s3 sync \
      . \
      's3://${storageBucket}/${simulationRunS3Path}' \
      --exclude '*' \
      --include '*.yml' \
      --include '*.yaml' \
      --content-type 'application/yaml'\
      --acl public-read

echo -e ''
echo -e '${cyan}================================================== Zipping outputs ==================================================${nc}'
srun --job-name="Zip-outputs" \
  zip \
    -x '${outputsPlotsFileSubPath}' \
    -r \
    '${OutputFileName.OUTPUT_ARCHIVE}' \
    ${outputsS3Subpath} \
    ${outputRawLogSubPath}

echo -e ''
echo -e '${cyan}=================================================== Saving outputs ==================================================${nc}'

# We run the upload in steps to 1) get the content types right, and 2) make sure the final log has the upload operation included

srun --job-name="Save-numerical-outputs-to-S3" \
  aws \
    --endpoint-url ${storageEndpoint} \
    s3 sync \
      . \
      's3://${storageBucket}/${simulationRunS3Path}' \
      --exclude '*' \
      --include '*.h5' \
      --include '*.hdf' \
      --include '*.hdf5' \
      --content-type 'application/hdf5'\
      --acl public-read

srun --job-name="Save-other-outputs-to-S3" \
  aws \
    --endpoint-url ${storageEndpoint} \
    s3 sync \
      . \
      's3://${storageBucket}/${simulationRunS3Path}' \
      --exclude "job.sbatch" \
      --exclude "*.h5" \
      --exclude "*.hdf" \
      --exclude "*.hdf5" \
      --exclude "*.yml" \
      --exclude "*.yaml" \
      --exclude "${combineArchiveFilename}" \
      --acl public-read

echo -e ''
echo -e '${cyan}====================================== Saving contents of COMBINE/OMEX archive ======================================${nc}'

srun --job-name="Unzip-COMBINE-archive" \
  unzip ${combineArchiveFilename} -d ${combineArchiveContentsDirname}

srun --job-name="Save-COMBINE-archive-contents-to-S3" \
  aws \
    --endpoint-url ${storageEndpoint} \
    s3 sync \
      ${combineArchiveContentsDirname} \
      's3://${storageBucket}/${simulationRunS3Path}/${combineArchiveContentsDirname}' \
      --include "*" \
      --acl public-read

rm -r ${combineArchiveContentsDirname}

echo -e ''
echo -e '${cyan}==================================================== Updating log ===================================================${nc}'

srun --job-name="Save-raw-log-to-S3-2" \
  aws \
    --endpoint-url ${storageEndpoint} \
    s3 sync \
      . \
      's3://${storageBucket}/${simulationRunS3Path}' \
      --exclude '*' \
      --include '${OutputFileName.RAW_LOG}' \
      --acl public-read

echo -e ''
echo -e '${cyan}=================================================== Saving results ==================================================${nc}'
srun --job-name="Save-results-to-HSDS" \
  hsload \
    --endpoint ${hsdsBasePath} \
    --user ${hsdsUsername} \
    --password ${hsdsPassword} \
    --retries ${hsdsRetries} \
    --verbose \
    ${outputsReportsFileSubPath} \
    '${simulationRunResultsHsdsPath}'

echo -e ''
echo -e '${cyan}================================================== Saving final log =================================================${nc}'
srun --job-name="Save-raw-log-to-S3-3" \
  aws \
    --endpoint-url ${storageEndpoint} \
    s3 sync \
      . \
      's3://${storageBucket}/${simulationRunS3Path}' \
      --exclude '*' \
      --include '${OutputFileName.RAW_LOG}' \
      --acl public-read
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

    const slurmConstraints = this.configService.get('hpc.slurm.constraints') || '';
    const slurmPartition = this.configService.get('hpc.slurm.partition');
    const slurmQos = this.configService.get('hpc.slurm.qos');

    const singularityModule = this.configService.get('hpc.singularity.module');
    const singularityCacheDir = this.configService.get('hpc.singularity.cacheDir');
    const singularityPullFolder = this.configService.get('hpc.singularity.pullFolder');

    const refreshImagesDir = this.configService.get('hpc.refreshImagesDir');
    const outputFilename = `${refreshImagesDir}/${simulator}/${simulatorVersion}.output`;

    const maxTime = this.configService.get('hpc.buildSingularityImage.maxTime');
    const cpus = this.configService.get('hpc.buildSingularityImage.cpus');
    const memory = this.configService.get('hpc.buildSingularityImage.memory');

    const template = generateImageUpdateSbatch({
      simulator,
      simulatorVersion,
      singularityPullFolder,
      outputFilename,
      cpus,
      memory,
      maxTime,
      slurmConstraints,
      slurmPartition,
      slurmQos,
      modulePath,
      moduleInitScript,
      executablesPath,
      singularityModule,
      singularityCacheDir,
      forceOverwrite,
      dockerImageUrl,
    });
    return template;
  }
}
