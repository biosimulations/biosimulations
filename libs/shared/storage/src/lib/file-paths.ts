import { Thumbnail, ThumbnailType } from '@biosimulations/datamodel/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FilePaths {
  private static simulationRunsPath = 'simulations';
  private static simulationRunContentsSubpath = 'contents';
  private static simulationRunThumbnailSubpath = 'thumbnails';
  private static simulationRunOutputsSubpath = 'outputs';
  private storageEndpoint: string;
  private storageWebEndpoint?: string;
  private bucket: string;

  public constructor(private configService: ConfigService) {
    const storageEndpoint =
      this.configService.get('storage.endpoint') ||
      'https://storage.googleapis.com';
    const bucket =
      this.configService.get('storage.bucket') || 'files.biosimulations.dev';
    this.storageEndpoint = storageEndpoint;
    this.bucket = bucket;
    this.storageWebEndpoint = this.configService.get('storage.webEndpoint');
  }

  /**
   * Get the URL for downloading a file from within a COMBINE archive.
   * The COMBINE archive is extracted to the s3 bucket. Returns a URL to the file in the s3 bucket
   * @param runId The id of the simulation run
   * @param fileLocation The path of the file within COMBINE archive relative to its root. Should not include './'
   * @returns A URL to download the file from within the COMBINE archive
   */
  public getSimulationRunFileContentEndpoint(
    runId: string,
    fileLocation: string,
    thumbnailType?: Thumbnail,
  ): string {
    const storageEndpoint =
      this.storageWebEndpoint || `${this.storageEndpoint}/${this.bucket}`;

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

  /**
   * Get the URL for downloading a file from within a COMBINE archive.
   * The COMBINE archive is extracted to the s3 bucket. Returns a URL to the file in the s3 bucket
   * @param runId The id of the simulation run
   * @param fileLocation The path of the file within COMBINE archive relative to its root. Should not include './'
   * @returns A URL to download the file from within the COMBINE archive
   */
  public getSimulationRunFileEndpoint(
    runId: string,
    fileLocation: string,
    thumbnailType?: Thumbnail,
  ): string {
    const storageEndpoint =
      this.storageWebEndpoint || `${this.storageEndpoint}/${this.bucket}`;
    return `${storageEndpoint}/${this.getSimulationRunPath(
      runId,
      fileLocation,
    )}`;
  }

  public getThumbnailEndpoint(
    fileUrl: string,
    thumbnailType: Thumbnail,
  ): string {
    const storageEndpoint = this.storageWebEndpoint || this.storageEndpoint;
    const runIdFileTypeLocation = fileUrl
      .substring(storageEndpoint.length + 1)
      .split('/');
    const runId = runIdFileTypeLocation[1];
    const fileLocation = runIdFileTypeLocation.slice(3).join('/');
    return this.getSimulationRunFileContentEndpoint(
      runId,
      fileLocation,
      thumbnailType,
    );
  }

  /**
   * Create a path a simulation run in an S3 bucket
   * @param runId Id of the simulation run
   * @param subPath Path relative to the root path for a simulation run
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
   * @param absolute Whether to get the absolute path, or the path relative to the S3 path for the simulation run
   */
  public getSimulationRunContentFilePath(
    runId: string,
    fileLocation?: string,
    thumbnailType?: ThumbnailType,
    absolute = true,
  ): string {
    if (fileLocation?.startsWith('./')) {
      fileLocation = fileLocation.substring(2);
    }
    const dirPath = thumbnailType
      ? FilePaths.simulationRunThumbnailSubpath + '/' + thumbnailType
      : FilePaths.simulationRunContentsSubpath;
    const filePath = fileLocation !== undefined ? `/${fileLocation}` : '';
    const relativePath = `${dirPath}${filePath}`;
    if (absolute) {
      return this.getSimulationRunPath(runId, relativePath);
    } else {
      return relativePath;
    }
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
   * Create a path for a log of a simulation run in an S3 bucket
   * @param runId Id of the simulation run
   * @param structured Whether to get the path for a structured (YAML) or plain text log
   * @param absolute Whether to get the absolute path, or the path relative to the S3 path for the simulation run
   */
  public getSimulationRunLogPath(
    runId: string,
    structured = true,
    absolute = true,    
  ): string {
    const relativePath = structured 
      ? `${FilePaths.simulationRunOutputsSubpath}/log.yml`
      : 'job.output';
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
