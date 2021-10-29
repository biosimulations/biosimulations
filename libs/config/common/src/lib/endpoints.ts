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
   * @returns The URL of the API
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
   * @param id The id of the simulation run
   * @returns The URL to get the simulation run
   */
  public getSimulationRunEndpoint(id?: string): string {
    id ? (id = `/${id}`) : (id = '');
    return `${this.simulationRuns}${id}`;
  }

  /**
   * Get the URL for a file object.
   * This URL points to the file object in the database, and is not a direct link to download the file
   * In some cases, the API may be configured to automatically forward to the file download URL, but this is not guaranteed
   *
   * @param id The id of the file
   * @returns Returns a URL that returns the file object from the databse
   */
  public getFilesEndpoint(id?: string): string {
    id ? (id = `/${id}`) : (id = '');
    return `${this.files}${id}`;
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

  /** Create a URL for getting a summary of a simulation run or each run
   *
   * @param id The id of the simulation run
   * @returns URL for getting a summary of a simulation run or each run
   */
  public getSimulationRunSummariesEndpoint(id?: string): string {
    if (id) {
      return `${this.simulationRuns}/${id}/summary`;
    } else {
      return `${this.simulationRuns}/summary`;
    }
  }

  /** Create a URL for validating a simulation run
   *
   * @param id The id of the simulation run
   * @returns URL for validating a simulation run
   */
  public getSimulationRunValidationEndpoint(id: string): string {
    return `${this.simulationRuns}/${id}/validate`;
  }

  /** Get the URL for information about a project or all projects
   * @param id The id of the project
   * @returns URL for information about a project or all projects
   */
  public getProjectsEndpoint(id?: string): string {
    return this.projects + (id ? `/${id}` : '');
  }

  /** Get the URL for a summary of a project or summaries of each project
   * @param id The id of the project
   * @returns URL for a summary of a project or summaries of each project
   */
  public getProjectSummariesEndpoint(id?: string): string {
    if (id) {
      return `${this.projects}/${id}/summary`;
    } else {
      return `${this.projects}/summary`;
    }
  }

  /** Get the URL for validating a project
   */
  public getValidateProjectEndpoint(): string {
    return this.projects + '/validate';
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
   * Create a URL for extracting the inputs and outputs of models
   * @returns A URL for extracting the inputs and outputs of models
   */
  public getModelIntrospectionEndpoint(): string {
    return `${this.combine_api}/sed-ml/get-parameters-variables-for-simulation`;
  }

  /**
   * Create a URL for creating COMBINE/OMEX archives
   * @returns A URL for creating COMBINE/OMEX archives
   */
  public getCombineArchiveCreationEndpoint(): string {
    return `${this.combine_api}/combine/create`;
  }

  /**
   *
   * @param id The id of the simulation run
   * @returns A URL to get the metadata of the simulation run
   */
  public getSimulationRunMetadataEndpoint(id?: string): string {
    id ? (id = `/${id}`) : (id = '');
    return `${this.simulationRunMetadata}${id}`;
  }

  /**
   * Returns the URL to download the omex file of a simulation run. The external parameter is used to determine if the
   * returned URL is accessible from outside the current environment.
   * Effectively, if true, then any localhost urls will be replaced with the dev deployment urls
   * @param id The id of the simulation run
   * @param external A boolean flag on whether the URL returned should be accessible from outside the current system.
   *
   * @returns A URL to download the omex file of a simulation run
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
   * @param id The id of the simulation run
   * @param external A boolean flag on whether the URL returned should be accessible from outside the current system.
   * @returns A URL to download the output of a simulation
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
   * @param id The id of the simulator
   * @param version The version of the simulator
   * @param includeTests Whether to include the results of the validation tests
   * @returns  A URL to get the simulators, and specific simulator, or a specific version of a simulator
   */
  public getSimulatorsEndpoint(
    id?: string,
    version?: string,
    includeTests = false,
  ): string {
    id ? (id = `/${id}`) : (id = '');
    version ? (version = `/${version}`) : (version = '');
    const tests = includeTests ? '?includeTests=true' : '';
    return `${this.simulators}${id}${version}${tests}`;
  }

  /**
   *
   * @param id The id of the simulator
   * @param includeTests Whether to include the results of the validation tests
   * @returns  A URL to get the latest version of each simulator, or the latest version of a specific simulator
   */
  public getLatestSimulatorsEndpoint(
    id?: string,
    includeTests = false,
  ): string {
    id ? (id = `?id=${id}`) : (id = '');
    const tests = includeTests ? '?includeTests=true' : '';
    return `${this.simulators}/latest${id}${tests}`;
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

  public getSimulationRunLogsEndpoint(id?: string): string {
    id ? (id = `/${id}`) : (id = '');
    return `${this.simulationRunLogs}${id}`;
  }

  public getApiHealthEndpoint(): string {
    return `${this.api}/health/status`;
  }

  public getSimulatorApiHealthEndpoint(): string {
    return `${this.simulators_api}/health`;
  }

  public getCombineHealthEndpoint(): string {
    return `${this.getCombineEndpoint()}/health`;
  }

  public getStorageHealthEndpoint(): string {
    return `${this.storage_endpoint}/helloWorld.txt`;
  }
  /**
   *
   * @returns The base URL of the COMBINE API
   */
  private getCombineEndpoint(): string {
    return this.combine_api;
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
}
