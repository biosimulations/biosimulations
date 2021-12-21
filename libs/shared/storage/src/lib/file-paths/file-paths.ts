import { Endpoints } from '@biosimulations/config/common';
import { envs } from '@biosimulations/shared/environments';

export class FilePaths {
  private endpoints: Endpoints;
  private static simulationRunsPath = 'simulations';
  private static simulationRunContentSubpath = 'contents';

  public constructor(env?: envs) {
    this.endpoints = new Endpoints(env);
  }

  /**
   * Get the URL for downloading a file from within a COMBINE archive.
   * The COMBINE archive is extracted to the s3 bucket. Returns a URL to the file in the s3 bucket
   * @param runId The id of the simulation run
   * @param fileLocation The path of the file within COMBINE archive relative to its root. Should not include './'
   * @returns A URL to download the file from within the COMBINE archive
   */
  public getSimulationRunFileContentEndpoint(
    external: boolean,
    runId: string,
    fileLocation: string,
  ): string {
    if (fileLocation.startsWith('./')) {
      fileLocation = fileLocation.substring(2);
    }

    const storageEndpoint = this.endpoints.getStorageEndpointBaseUrl(external);
    if (fileLocation == '.') {
      return `${storageEndpoint}/${this.getSimulationRunCombineArchivePath(
        runId,
      )}`;
    } else {
      return `${storageEndpoint}/${this.getSimulationRunPath(
        runId,
        `contents/${fileLocation}`,
      )}`;
    }
  }

  /**
   * Create a path a simulation run in an S3 bucket
   * @param runId Id of the simulation run
   */
  public getSimulationRunPath(runId: string, subPath?: string): string {
    subPath = subPath ? `/${subPath}` : '';
    return `${FilePaths.simulationRunsPath}/${runId}${subPath}`;
  }

  /**
   * Create a path for the COMBINE/OMEX archive of a simulation run in an S3 bucket
   * @param runId Id of the simulation run
   */
  public getSimulationRunCombineArchivePath(runId: string): string {
    return this.getSimulationRunPath(runId, 'archive.omex');
  }

  /**
   * Create a path for a file of a simulation run in an S3 bucket
   * @param runId Id of the simulation run
   * @param fileLocation Location of a file in the COMBINE/OMEX archive for the simulation run
   */
  public getSimulationRunContentFilePath(
    runId: string,
    fileLocation?: string,
  ): string {
    const filePath = fileLocation ? `/${fileLocation}` : '';
    return this.getSimulationRunPath(
      runId,
      `${FilePaths.simulationRunContentSubpath}${filePath}`,
    );
  }

  /**
   * Create a path for a zip archive of the results of a simulation run in an S3 bucket
   * @param runId Id of the simulation run
   * @param absolute Whether to get the absolute path, or the path relative to the S3 path for the simulation run
   */
  public getSimulationRunOutputPath(runId: string, absolute = true): string {
    if (absolute) {
      return this.getSimulationRunPath(runId, `${runId}.zip`);
    } else {
      return `${runId}.zip`;
    }
  }
}
