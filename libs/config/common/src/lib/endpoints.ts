import { environment } from '@biosimulations/shared/environments';

/**
 * A class that returns various endpoints based on the environment and ids of resources.
 * In general this class should not be used to get endpoints that are then called directly.
 * For that use case, the appropriate API client library should be used. Instead, this class is
 * used when the application/api needs to return/display the URL so that the user can then call at a later time.
 */

export class Endpoints {
  private api: string;
  private simulators_api: string;
  private combine_api: string;
  private simulationRuns: string;
  private simulationRunResults: string;
  private simulationRunLogs: string;
  private simulationRunMetadata: string;
  private simulators: string;
  private files: string;
  private env: string;
  private combineFile: string;
  private storage_endpoint: string;
  private specifications: string;
  private projects: string;
  public constructor(env?: 'local' | 'dev' | 'stage' | 'prod') {
    // We can read the env that is provided in the shared env file as the default
    if (env == undefined) {
      env = environment.env;
    }
    this.env = env;
    switch (env) {
      case 'local':
        this.api = 'http://localhost:3333';
        this.simulators_api = 'https://api.biosimulators.dev';
        this.combine_api = '/combine-api';
        this.storage_endpoint = 'https://files-dev.biosimulations.org/s3';
        break;

      case 'dev':
        this.api = 'https://api.biosimulations.dev';
        this.simulators_api = 'https://api.biosimulators.dev';
        this.combine_api = 'https://combine.api.biosimulations.dev';
        this.storage_endpoint = 'https://files-dev.biosimulations.org/s3';
        break;

      case 'stage':
        this.api = 'https://api.biosimulations.dev';
        this.simulators_api = 'https://api.biosimulators.dev';
        this.combine_api = 'https://combine.api.biosimulations.dev';
        this.storage_endpoint = 'https://files-dev.biosimulations.org/s3';
        break;

      case 'prod':
        this.api = 'https://api.biosimulations.org';
        this.simulators_api = 'https://api.biosimulators.org';
        this.combine_api = 'https://combine.api.biosimulations.org';
        this.storage_endpoint = 'https://files.biosimulations.org/s3';
        break;
    }

    this.simulationRunLogs = `${this.api}/logs`;
    this.simulationRunResults = `${this.api}/results`;
    this.simulationRunMetadata = `${this.api}/metadata`;
    this.simulationRuns = `${this.api}/runs`;
    this.simulators = `${this.simulators_api}/simulators`;
    this.files = `${this.api}/files`;
    this.combineFile = `${this.combine_api}/combine/file`;
    this.specifications = `${this.api}/specifications`;
    this.projects = `${this.api}/projects`;
  }

  /**
   *
   * @returns The URL of the api
   */
  public getBaseUrl(): string {
    return this.api;
  }

  /**
   *
   * @returns The endpoint prefix for the ontologies
   */
  public getOntologyEndpoint(): string {
    return `${this.getBaseUrl()}/ontologies`;
  }

  /**
   *
   * @param runId The id of the simulation run
   * @param fileLocation The location of the file within the COMBINE/OMEX archive for the simulation run
   * @returns The URL to get the content of a combine archive
   */
  public getArchiveContentsEndpoint(
    runId?: string,
    fileLocation?: string,
  ): string {
    if (runId) {
      runId = '/' + runId;
      if (fileLocation) {
        fileLocation = '/' + fileLocation;
      } else {
        fileLocation = '';
      }
    } else {
      runId = '';
      fileLocation = '';
    }
    if (fileLocation && !runId) {
      throw new Error('Cannot get a file without a run id');
    }
    return `${this.files}${runId}${fileLocation}`;
  }

  /**
   *
   * @param runId The id of the simulation run
   * @returns The URL to get the simulation run
   */
  public getSimulationRunEndpoint(runId?: string): string {
    runId ? (runId = `/${runId}`) : (runId = '');
    return `${this.simulationRuns}${runId}`;
  }

  /**
   * Get the URL for a file object.
   * This URL points to the file object in the database, and is not a direct link to download the file
   * In some cases, the API may be configured to automatically forward to the file download URL, but this is not guaranteed
   *
   * @param runId The id of the file
   * @returns Returns a URL that returns the file object from the databse
   */
  public getFilesEndpoint(runId?: string): string {
    runId ? (runId = `/${runId}`) : (runId = '');
    return `${this.files}${runId}`;
  }

  /**
   * Get the URL for downloading a file from within a combine archive.
   * The combine archive is extracted to the s3 bucket. Returns a URL to the file in the s3 bucket
   * @param runId The id of the simulation run
   * @param fileLocation The path of the file within combine archive relative to its root. Should not include './'
   * @returns A URL to download the file from within the combine archive
   */
  public getSimulationRunFileEndpoint(
    runId: string,
    fileLocation: string,
  ): string {
    if (fileLocation.startsWith('./')) {
      fileLocation = fileLocation.substring(2);
    }
    if (fileLocation == '.') {
      fileLocation = 'input.omex';
    }
    return `${this.storage_endpoint}/simulations/${runId}/contents/${fileLocation}`;
  }

  public getProjectsEndpoint(projectId?: string): string {
    return this.projects + (projectId ? `/${projectId}` : '');
  }

  /**
   * Create a URL to download a file from an omex file using the combine service
   * @param archiveUrl The URL of a combine archive
   * @param fileLocation The location of the file within the archive
   * @returns A URL that resolves to a specific file within a combine archive
   * @deprecated use getSimulationRunFileEndpoint instead if the simulation run has been submitted
   * @see getSimulationRunFileEndpoint
   */
  private getCombineFilesEndpoint(
    archiveUrl: string,
    fileLocation: string,
    external = false,
  ): string {
    if (external) {
      if (this.env == 'local') {
        return new Endpoints('dev').getCombineFilesEndpoint(
          archiveUrl,
          fileLocation,
          true,
        );
      }
    }
    return `${this.combineFile}?url=${encodeURIComponent(
      archiveUrl,
    )}&location=${encodeURIComponent(fileLocation)}`;
  }

  /**
   * Create a URL to add a file to an OMEX file using the combine service
   * @returns A URL for POST endpoint for adding a file to an OMEX file using the combine service
   */
  public getAddFileToCombineArchiveEndpoint(external = false): string {
    if (external) {
      if (this.env == 'local') {
        return new Endpoints('dev').getAddFileToCombineArchiveEndpoint(true);
      }
    }
    return this.combineFile;
  }

  /**
   *
   * @param runId The id of the simulation run
   * @returns A URL to get the metadata of the simulation run
   */
  public getSimulationRunMetadataEndpoint(runId?: string): string {
    runId ? (runId = `/${runId}`) : (runId = '');
    return `${this.simulationRunMetadata}${runId}`;
  }

  /**
   * Returns the URL to download the omex file of a simulation run. The external parameter is used to determine if the
   * returned URL is accessible from outside the current environment.
   * Effectively, if true, then any localhost urls will be replaced with the dev deployment urls
   * @param runId The id of the simulation run
   * @param external A boolean flag on whether the URL returned should be accessible from outside the current system.
   *
   * @returns A URL to download the omex file of a simulation run
   */
  public getRunDownloadEndpoint(runId: string, external = false): string {
    if (external) {
      if (this.env == 'local') {
        return new Endpoints('dev').getRunDownloadEndpoint(runId, external);
      }
    }

    return `${this.simulationRuns}/${runId}/download`;
  }

  /**
   * Returns the URL to get the results of  a simulation run. The external parameter is used to determine if the
   * returned URL is accessible from outside the current environment.
   * Effectively, if true, then any localhost urls will be replaced with the dev deployment urls
   * @param runId The id of the simulation run
   * @param experimentLocationAndOutputId The id of the result output
   * @param includeData How the includeData param should be set on the URL
   * @param external A boolean flag on whether the URL returned should be accessible from outside the current system.
   *
   * @returns A URL to retrieve the results of a simulation run
   */
  public getRunResultsEndpoint(
    runId?: string,
    experimentLocationAndOutputId?: string,
    includeData = false,
    external = false,
  ): string {
    runId ? (runId = `/${encodeURIComponent(runId)}`) : (runId = '');
    experimentLocationAndOutputId
      ? (experimentLocationAndOutputId = `/${encodeURIComponent(
          experimentLocationAndOutputId,
        )}`)
      : (experimentLocationAndOutputId = '');
    if (experimentLocationAndOutputId && !runId) {
      throw new Error('Cannot get results of an output without an id');
    }

    if (external) {
      if (this.env == 'local') {
        return new Endpoints('dev').getRunResultsEndpoint(
          runId,
          experimentLocationAndOutputId,
          includeData,
          external,
        );
      }
    }
    return `${this.simulationRunResults}${runId}${experimentLocationAndOutputId}?includeData=${includeData}`;
  }

  /**
   *
   * @param runId The id of the simulation run
   * @param external A boolean flag on whether the URL returned should be accessible from outside the current system.
   * @returns A URL to download the output of a simulation
   */
  public getRunResultsDownloadEndpoint(
    runId: string,
    external = false,
  ): string {
    if (external) {
      if (this.env == 'local') {
        return new Endpoints('dev').getRunResultsDownloadEndpoint(
          runId,
          external,
        );
      }
    }
    return `${this.simulationRunResults}/${runId}/download`;
  }

  /**
   *
   * @param id The id of the simulator
   * @params version The version of the simulator
   * @returns  A URL to get the simulators, and specific simulator, or a specific version of a simulator
   */
  public getSimulatorsEndpoint(id?: string, version?: string): string {
    id ? (id = `/${id}`) : (id = '');
    version ? (version = `/${version}`) : (version = '');
    return `${this.simulators}${id}${version}`;
  }

  /**
   *
   * @param id The id of the simulator
   * @returns  A URL to get the latest version of each simulator, or the latest version of a specific simulator
   */
  public getLatestSimulatorsEndpoint(id?: string): string {
    id ? (id = `?id=${id}`) : (id = '');
    return `${this.simulators}/latest${id}`;
  }

  /**
   *
   * @param runId The id of the simulation run
   * @param experimentLocation The local of the particular simulation spec (SED-ML file )
   * @returns The URL to the specified simulation spec
   */
  public getSpecificationsEndpoint(
    runId?: string,
    experimentLocation?: string,
  ): string {
    runId ? (runId = `/${runId}`) : (runId = '');
    experimentLocation
      ? (experimentLocation = `/${experimentLocation}`)
      : (experimentLocation = '');
    if (experimentLocation && !runId) {
      throw new Error('Cannot get a specific specification without a run id');
    }

    return `${this.specifications}${runId}${experimentLocation}`;
  }

  public getSimulationRunLogsEndpoint(runId?: string): string {
    runId ? (runId = `/${runId}`) : (runId = '');
    return `${this.simulationRunLogs}${runId}`;
  }

  /**
   *
   * @returns The base URL of the combine api
   */
  private getCombineEndpoint(): string {
    return this.combine_api;
  }
}
