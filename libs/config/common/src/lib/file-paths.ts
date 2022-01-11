import { Endpoints } from './endpoints';
import { ThumbnailType } from './ui';
import { envs } from '@biosimulations/shared/environments';

export class FilePaths {
  private endpoints: Endpoints;
  private static simulationRunsPath = 'simulations';
  private static simulationRunContentsSubpath = 'contents';
  private static simulationRunThumbnailSubpath = 'thumbnails';
  private static simulationRunOutputsSubpath = 'outputs';

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
    thumbnailType?: ThumbnailType,
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
      return `${storageEndpoint}/${this.getSimulationRunContentFilePath(
        runId,
        fileLocation,
        thumbnailType,
      )}`;
    }
  }

  public getThumbnailEndpoint(
    external: boolean,
    fileUrl: string,
    thumbnailType: ThumbnailType,
  ): string {
    const storageEndpoint = this.endpoints.getStorageEndpointBaseUrl(external);
    const runIdFileTypeLocation = fileUrl
      .substring(storageEndpoint.length + 1)
      .split('/');
    const runId = runIdFileTypeLocation[1];
    const fileLocation = runIdFileTypeLocation.slice(3).join('/');
    return this.getSimulationRunFileContentEndpoint(
      true,
      runId,
      fileLocation,
      thumbnailType,
    );
  }

  /**
   * Create a path a simulation run in an S3 bucket
   * @param runId Id of the simulation run
   */
  public getSimulationRunPath(runId: string, subPath?: string): string {
    subPath = subPath !== undefined ? `/${subPath}` : '';
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
    thumbnailType?: ThumbnailType,
  ): string {
    const dirPath = thumbnailType
      ? FilePaths.simulationRunThumbnailSubpath + '/' + thumbnailType
      : FilePaths.simulationRunContentsSubpath;
    const filePath = fileLocation !== undefined ? `/${fileLocation}` : '';
    return this.getSimulationRunPath(runId, `${dirPath}${filePath}`);
  }

  /**
   * Create a path for a zip archive of the results of a simulation run in an S3 bucket
   * @param runId Id of the simulation run
   * @param absolute Whether to get the absolute path, or the path relative to the S3 path for the simulation run
   */
  public getSimulationRunOutputArchivePath(
    runId: string,
    absolute = true,
  ): string {
    const relativePath = `${runId}.zip`;
    if (absolute) {
      return this.getSimulationRunPath(runId, relativePath);
    } else {
      return relativePath;
    }
  }

  /**
   * Create a path for a directory of outputs of a simulation run in an S3 bucket
   * @param runId Id of the simulation run
   * @param absolute Whether to get the absolute path, or the path relative to the S3 path for the simulation run
   */
  public getSimulationRunOutputsPath(runId: string, absolute = true): string {
    const relativePath = FilePaths.simulationRunOutputsSubpath;
    if (absolute) {
      return this.getSimulationRunPath(runId, relativePath);
    } else {
      return relativePath;
    }
  }
}
