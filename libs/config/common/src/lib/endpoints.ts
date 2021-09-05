import { environment } from '@biosimulations/shared/environments';

/**
 * A class that returns various endpoints based on the environment and ids of resources.
 * In general this class should not be used to get endpoints that are then called directly.
 * For that use case, the appropriate API client library should be used. Instead, this class is
 * used when the application/api needs to return/display the URL so that the user can then call at a later time.
 */

export class Endpoints {
  private api: string;
  private combine_api: string;
  private simulationRuns: string;
  private simulationRunResults: string;
  private simulationRunLogs: string;
  private simulationRunMetadata: string;
  private simulators: string;
  private files: string;
  private env: string;
  private combineFile: string;

  public constructor(env?: 'local' | 'dev' | 'stage' | 'prod') {
    // We can read the env that is provided in the shared env file as the default
    if (env == undefined) {
      env = environment.env;
    }
    this.env = env;
    switch (env) {
      case 'local':
        this.api = 'http://localhost:3333';
        this.combine_api = 'https://combine.api.biosimulations.dev';
        break;

      case 'dev':
        this.api = 'https://api.biosimulations.dev';
        this.combine_api = 'https://combine.api.biosimulations.dev';
        break;

      case 'stage':
        this.api = 'https://api.biosimulations.dev';
        this.combine_api = 'https://combine.api.biosimulations.dev';
        break;

      case 'prod':
        this.api = 'https://api.biosimulations.org';
        this.combine_api = 'https://combine.api.biosimulations.org';
        break;

      default:
        this.api = 'https://api.biosimulations.dev';
        this.combine_api = 'https://combine.api.biosimulations.dev';
    }

    this.simulationRunLogs = `${this.api}/logs`;
    this.simulationRunResults = `${this.api}/results`;
    this.simulationRunMetadata = `${this.api}/metadata`;
    this.simulationRuns = `${this.api}/runs`;
    this.simulators = `${this.api}/simulators`;
    this.files = `${this.api}/files`;
    this.combineFile = `${this.combine_api}/combine/file`;
  }
  /**
   *
   * @returns The url of the api
   */
  public getBaseUrl(): string {
    return this.api;
  }

  /**
   *
   * @returns The base url of the combine api
   */
  public getCombineEndpoint(): string {
    return this.combine_api;
  }
  /**
   * Create a url to download a file from an omex file using the combine service
   * @param url The url of a combine archive
   * @param location The location of the file within the archive
   * @returns A url that resolves to a specific file within a combine archive
   */
  public getCombineFilesEndpoint(url: string, location: string): string {
    return `${this.combineFile}?url=${encodeURIComponent(
      url,
    )}&location=${encodeURIComponent(location)}`;
  }

  /**
   *
   * @param id The id of the simulation run
   * @returns A url to get the metadata of the simulation run
   */
  public getMetadataEndpoint(id?: string): string {
    id ? (id = `/${id}`) : (id = '');
    return `${this.simulationRunMetadata}${id}`;
  }
  /**
   *
   * @param id The id of the simulation run
   * @returns A url to get the simulation run
   */
  public getRunsEndpoint(id?: string): string {
    id ? (id = `/${id}`) : (id = '');
    return `${this.simulationRuns}${id}`;
  }
  /**
   * Returns the url to download the omex file of a simulation run. The external parameter is used to determine if the
   * returned url is accessible from outside the current environment.
   * Effectively, if true, then any localhost urls will be replaced with the dev deployment urls
   * @param id The id of the simulation run
   * @param external A boolean flag on whether the url returned should be accessible from outside the current system.
   *
   * @returns A url to download the omex file of a simulation run
   */
  public getRunDownloadEndpoint(id: string, external = false): string {
    if (external) {
      if (this.env == 'local') {
        return new Endpoints('dev').getRunDownloadEndpoint(id, external);
      }
    }

    return `${this.simulationRuns}/${id}/download`;
  }
  /**
   * Returns the url to get the results of  a simulation run. The external parameter is used to determine if the
   * returned url is accessible from outside the current environment.
   * Effectively, if true, then any localhost urls will be replaced with the dev deployment urls
   * @param id The id of the simulation run
   * @param output The id of the result output
   * @param includeData How the includeData param should be set on the url
   * @param external A boolean flag on whether the url returned should be accessible from outside the current system.
   *
   * @returns A url to retrieve the results of a simulation run
   */
  public getRunResultsEndpoint(
    id?: string,
    outputId?: string,
    includeData = false,
    external = false,
  ): string {
    id ? (id = `/${encodeURIComponent(id)}`) : (id = '');
    outputId ? (outputId = `/${encodeURIComponent(outputId)}`) : (outputId = '');
    if (outputId && !id) {
      throw new Error('Cannot get results of an output without an id');
    }

    if (external) {
      if (this.env == 'local') {
        return new Endpoints('dev').getRunResultsEndpoint(
          id,
          outputId,
          includeData,
          external,
        );
      }
    }
    return `${this.simulationRunResults}${
      id
    }${outputId}?includeData=${includeData}`;
  }
  /**
   *
   * @param id The id of the simulation run
   * @param external A boolean flag on whether the url returned should be accessible from outside the current system.
   * @returns A url to download the output of a simulation
   */
  public getRunResultsDownloadEndpoint(id: string, external = false): string {
    if (external) {
      if (this.env == 'local') {
        return new Endpoints('dev').getRunResultsDownloadEndpoint(id, external);
      }
    }
    return `${this.simulationRunResults}/${id}/download`;
  }
  /**
   *
   * @param id The id of the simulation run
   * @returns A url to get the logs of the simulation run
   */
  public getRunLogsEndpoint(id?: string): string {
    id ? (id = `/${id}`) : (id = '');
    return `${this.simulationRunLogs}${id}`;
  }
  /**
   *
   * @param id The id of the simulator
   * @params version The version of the simulator
   * @returns  A url to get the simulators, and specific simulator, or a specific version of a simulator
   */
  public getSimulatorsEndpoint(id?: string, version?: string): string {
    id ? (id = `/${id}`) : (id = '');
    version ? (version = `/${version}`) : (version = '');

    if (version && !id) {
      throw new Error(
        'Cannot get a specific version of a simulator without an id',
      );
    }

    return `${this.simulators}${id}${version}`;
  }
  /**
   * Get the url for a file object.
   * This url points to the file object in the database, and is not a direct link to download the file
   * In some cases, the API may be configured to automatically forward to the file download url, but this is not guaranteed
   *
   * @param id The id of the file
   * @returns Returns a url that returns the file object from the databse
   */
  public getFilesEndpoint(id?: string): string {
    id ? (id = `/${id}`) : (id = '');
    return `${this.files}${id}`;
  }
}
