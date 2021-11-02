import { environment } from '@biosimulations/shared/environments';
// import { SedElementType } from '@biosimulations/datamodel/common';

/**
 * A class that returns various endpoints based on the environment and ids of resources.
 * In general this class should not be used to get endpoints that are then called directly.
 * For that use case, the appropriate API client library should be used. Instead, this class is
 * used when the application/api needs to return/display the URL so that the user can then call at a later time.
 */

export class Endpoints {
  private api: string;
  private simulatorsApi: string;
  private combineApi: string;
  private storageEndpoint: string;
  private simulationRunsS3Path: string;
  private simulationRunContentS3Subpath: string;
  private simulationRunResultsHsdsPath: string;
  private simulatorsApp: string;
  private dispatchApp: string;
  private platformApp: string;

  private simulationRuns: string;
  private simulationRunResults: string;
  private simulationRunLogs: string;
  private simulationRunMetadata: string;
  private simulators: string;
  private files: string;
  private env: string;
  private combineFile: string;
  private specifications: string;
  private projects: string;

  public constructor(env?: 'local' | 'dev' | 'stage' | 'prod') {
    // We can read the env that is provided in the shared environment file as the default
    if (env == undefined) {
      env = environment.env;
    }
    this.env = env;
    switch (env) {
      case 'local':
        this.api = 'http://localhost:3333';
        this.simulatorsApi = 'https://api.biosimulators.dev';
        this.combineApi = '/combine-api';
        this.storageEndpoint = 'https://files-dev.biosimulations.org/s3';
        this.simulatorsApp = 'https://biosimulators.dev';
        this.dispatchApp = 'https://run.biosimulations.dev';
        this.platformApp = 'https://biosimulations.dev';
        break;

      case 'dev':
        this.api = 'https://api.biosimulations.dev';
        this.simulatorsApi = 'https://api.biosimulators.dev';
        this.combineApi = 'https://combine.api.biosimulations.dev';
        this.storageEndpoint = 'https://files-dev.biosimulations.org/s3';
        this.simulatorsApp = 'https://biosimulators.dev';
        this.dispatchApp = 'https://run.biosimulations.dev';
        this.platformApp = 'https://biosimulations.dev';
        break;

      case 'stage':
        this.api = 'https://api.biosimulations.dev';
        this.simulatorsApi = 'https://api.biosimulators.dev';
        this.combineApi = 'https://combine.api.biosimulations.dev';
        this.storageEndpoint = 'https://files-dev.biosimulations.org/s3';
        this.simulatorsApp = 'https://biosimulators.dev';
        this.dispatchApp = 'https://run.biosimulations.dev';
        this.platformApp = 'https://biosimulations.dev';
        break;

      case 'prod':
        this.api = 'https://api.biosimulations.org';
        this.simulatorsApi = 'https://api.biosimulators.org';
        this.combineApi = 'https://combine.api.biosimulations.org';
        this.storageEndpoint = 'https://files.biosimulations.org/s3';
        this.simulatorsApp = 'https://biosimulators.org';
        this.dispatchApp = 'https://run.biosimulations.org';
        this.platformApp = 'https://biosimulations.org';
        break;
    }

    this.simulationRunsS3Path = 'simulations';
    this.simulationRunContentS3Subpath = 'contents';
    this.simulationRunResultsHsdsPath = 'results';

    this.simulationRunLogs = `${this.api}/logs`;
    this.simulationRunResults = `${this.api}/results`;
    this.simulationRunMetadata = `${this.api}/metadata`;
    this.simulationRuns = `${this.api}/runs`;
    this.simulators = `${this.simulatorsApi}/simulators`;
    this.files = `${this.api}/files`;
    this.combineFile = `${this.combineApi}/combine/file`;
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
   * @returns The URL to get the content of a COMBINE archive
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
   * Get the URL for downloading a file from within a COMBINE archive.
   * The COMBINE archive is extracted to the s3 bucket. Returns a URL to the file in the s3 bucket
   * @param runId The id of the simulation run
   * @param fileLocation The path of the file within COMBINE archive relative to its root. Should not include './'
   * @returns A URL to download the file from within the COMBINE archive
   */
  public getSimulationRunFileEndpoint(
    runId: string,
    fileLocation: string,
  ): string {
    if (fileLocation.startsWith('./')) {
      fileLocation = fileLocation.substring(2);
    }
    if (fileLocation == '.') {
      return `${
        this.storageEndpoint
      }/${this.getSimulationRunCombineArchiveS3Path(runId)}`;
    } else {
      return `${this.storageEndpoint}/${this.getSimulationRunS3Path(
        runId,
      )}/contents/${fileLocation}`;
    }
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
   * Create a URL to add a file to an OMEX file using the COMBINE service
   * @returns A URL for POST endpoint for adding a file to an OMEX file using the COMBINE service
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
    return `${this.combineApi}/sed-ml/get-parameters-variables-for-simulation`;
  }

  /**
   * Create a URL for creating COMBINE/OMEX archives
   * @returns A URL for creating COMBINE/OMEX archives
   */
  public getCombineArchiveCreationEndpoint(): string {
    return `${this.combineApi}/combine/create`;
  }

  public getSedmlSpecificationsEndpoint(): string {
    return `${this.combineApi}/combine/sedml-specs`;
  }

  public getCombineArchiveMetadataEndpoint(): string {
    return `${this.combineApi}/combine/metadata/biosimulations`;
  }

  public getValidateModelEndpoint(): string {
    return `${this.combineApi}/model/validate`;
  }

  public getValidateSedmlEndpoint(): string {
    return `${this.combineApi}/sed-ml/validate`;
  }

  public getValidateOmexMetadataEndpoint(): string {
    return `${this.combineApi}/omex-metadata/validate`;
  }

  public getValidateCombineArchiveEndpoint(): string {
    return `${this.combineApi}/combine/validate`;
  }

  public getSimilarAlgorithmsEndpoint(): string {
    return `${this.combineApi}/kisao/get-similar-algorithms`;
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
   * Returns the URL to download the COMBINE/OMEX archive of a simulation run. The external parameter is used to determine if the
   * returned URL is accessible from outside the current environment.
   * Effectively, if true, then any localhost urls will be replaced with the dev deployment urls
   * @param id The id of the simulation run
   * @param external A boolean flag on whether the URL returned should be accessible from outside the current system.
   *
   * @returns A URL to download the COMBINE/OMEX archive of a simulation run
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
    elementType?: string, // SedElementType
    elementId?: string,
  ): string {
    runId ? (runId = `/${runId}`) : (runId = '');
    experimentLocation
      ? (experimentLocation = `/${experimentLocation}`)
      : (experimentLocation = '');

    let elementTypePath!: string;
    switch (elementType) {
      case 'SedModel':
        elementTypePath = '/models';
        break;
      case 'SedSimulation':
        elementTypePath = '/simulations';
        break;
      case 'SedTask':
        elementTypePath = '/tasks';
        break;
      case 'SedDataGenerator':
        elementTypePath = '/data-generators';
        break;
      case 'SedOutput':
        elementTypePath = '/outputs';
        break;
      default:
        elementTypePath = '';
        break;
    }
    elementId ? (elementId = `/${elementId}`) : (elementId = '');
    if (experimentLocation && !runId) {
      throw new Error('Cannot get a specific specification without a run id');
    }
    if ((elementType || elementId) && !experimentLocation) {
      throw new Error(
        'Cannot get a specific element without an experiment location',
      );
    }
    if (elementId && !elementType) {
      throw new Error('Cannot get a specific element without a type');
    }
    if (elementType && !elementId) {
      throw new Error('Cannot get a specific element without an id');
    }

    return `${this.specifications}${runId}${experimentLocation}${elementTypePath}${elementId}`;
  }

  public getSimulationRunLogsEndpoint(id?: string): string {
    id ? (id = `/${id}`) : (id = '');
    return `${this.simulationRunLogs}${id}`;
  }

  public getApiHealthEndpoint(): string {
    return `${this.api}/health/status`;
  }

  public getSimulatorApiHealthEndpoint(): string {
    return `${this.simulatorsApi}/health`;
  }

  public getCombineHealthEndpoint(): string {
    return `${this.combineApi}/health`;
  }

  public getStorageHealthEndpoint(): string {
    return `${this.storageEndpoint}/helloWorld.txt`;
  }
  /**
   * Create a URL to download a file from an COMBINE/OMEX archive using the COMBINE service
   * @param archiveUrl The URL of a COMBINE archive
   * @param fileLocation The location of the file within the archive
   * @returns A URL that resolves to a specific file within a COMBINE archive
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
   * Create a path a simulation run in an S3 bucket
   * @param runId Id of the simulation run
   */
  public getSimulationRunS3Path(runId: string): string {
    return `${this.simulationRunsS3Path}/${runId}`;
  }

  /**
   * Create a path for the COMBINE/OMEX archive of a simulation run in an S3 bucket
   * @param runId Id of the simulation run
   */
  public getSimulationRunCombineArchiveS3Path(runId: string): string {
    return `${this.getSimulationRunS3Path(runId)}/archive.omex`;
  }

  /**
   * Create a path for the contents of a COMBINE/OMEX archive of a simulation run, relative to the S3 bucket path for the run
   */
  public getSimulationRunContentS3Subpath(): string {
    return this.simulationRunContentS3Subpath;
  }

  /**
   * Create a path for a file of a simulation run in an S3 bucket
   * @param runId Id of the simulation run
   * @param fileLocation Location of a file in the COMBINE/OMEX archive for the simulation run
   */
  public getSimulationRunContentFileS3Path(
    runId: string,
    fileLocation: string,
  ): string {
    return `${this.getSimulationRunS3Path(runId)}/${
      this.simulationRunContentS3Subpath
    }/${location}`;
  }

  /**
   * Create a path for a file of a simulation run in an S3 bucket
   * @param fileId Id of the file of a simulation run (`${runId}/contents/${fileLocationInCombineArchive}`)
   */
  public getSimulationRunFileS3Path(fileId: string): string {
    return `${this.simulationRunsS3Path}/${fileId}`;
  }

  /**
   * Create a path for a zip archive of the results of a simulation run in an S3 bucket
   * @param runId Id of the simulation run
   * @param absolute Whether to get the absolute path, or the path relative to the S3 path for the simulation run
   */
  public getSimulationRunOutputS3Path(runId: string, absolute = true): string {
    if (absolute) {
      return `${this.getSimulationRunS3Path(runId)}/${runId}.zip`;
    } else {
      return `${runId}.zip`;
    }
  }

  /**
   * Create a path for the results of a simulation run in a HSDS
   * @param runId Id of the simulation run
   */
  public getSimulationRunResultsHsdsPath(runId?: string): string {
    runId ? (runId = `/${runId}`) : (runId = '');
    return `/${this.simulationRunResultsHsdsPath}${runId}`;
  }

  /**
   * Create a domain for the results of a simulation run in a HSDS
   * @param runId Id of the simulation run
   */
  public getSimulationRunResultsHsdsDomain(runId?: string): string {
    runId ? (runId = `${runId}.`) : (runId = '');
    return `${runId}${this.simulationRunResultsHsdsPath}`;
  }

  public getSimulatorsAppHome(): string {
    return this.simulatorsApp;
  }

  public getDispatchAppHome(): string {
    return this.dispatchApp;
  }

  public getPlatformAppHome(): string {
    return this.platformApp;
  }

  public getSimulatorsView(id?: string, version?: string): string {
    id ? (id = `/${id}`) : (id = '');
    version ? (version = `/${id}`) : (version = '');
    if (version && !id) {
      throw new Error('Cannot get a version without a simulator id');
    }
    return `${this.simulatorsApp}/simulators${id}${version}`;
  }

  public getSimulationRunsView(id?: string): string {
    id ? (id = `/${id}`) : (id = '');
    return `${this.dispatchApp}/simulations{id}`;
  }

  public getProjectsView(id?: string): string {
    id ? (id = `/${id}`) : (id = '');
    return `${this.platformApp}/projects{id}`;
  }

  public getSimulatorIdentifier(id: string, identifiersOrg = false): string {
    if (identifiersOrg) {
      return `http://identifiers.org/biosimulators:${id}`;
    } else {
      return this.getSimulatorsView(id).replace('https://', 'http://');
    }
  }

  public getSimulatorRunIdentifier(id: string, identifiersOrg = false): string {
    if (identifiersOrg) {
      return `http://identifiers.org/runbiosimulations:${id}`;
    } else {
      return this.getSimulationRunsView(id).replace('https://', 'http://');
    }
  }

  public getProjectIdentifier(id: string, identifiersOrg = false): string {
    if (identifiersOrg) {
      return `http://identifiers.org/biosimulations:${id}`;
    } else {
      return this.getProjectsView(id).replace('https://', 'http://');
    }
  }

  public getConventionsView(page?: string): string {
    page ? (page = `/${page}`) : (page = '');
    return `${this.simulatorsApp}/conventions{page}`;
  }
}
