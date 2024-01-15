import { environment, envs } from '@biosimulations/shared/environments';
import { Thumbnail } from '@biosimulations/datamodel/common';
import { EndpointLoader, LoadedEndpoints } from './endpointLoader';

/**
 * A class that returns various endpoints based on the environment and ids of resources.
 * In general this class should not be used to get endpoints that are then called directly.
 * For that use case, the appropriate API client library should be used. Instead, this class is
 * used when the application/api needs to return/display the URL so that the user can then call at a later time.
 */

export class Endpoints {
  /* Back end services */
  private api: string;
  private simulatorsApi: string;
  private combineApi: string;
  private simdataApi: string;

  /* Backend public/external services (i.e. Use endpoints that can be accessed via public URL. */
  /* For example, https://api will work to access the API within kubernetes, but not for the end-user */
  private externalApi: string;
  private externalSimulatorsApi: string;
  private externalCombineApi: string;
  private externalSimdataApi: string;

  public constructor(env?: envs) {
    /* We can read the env that is provided in the shared environment file as the default */
    if (env == undefined) {
      env = environment.env;
    }

    const endpointLoader = new EndpointLoader(env);
    const loadedEndpoints: LoadedEndpoints = endpointLoader.loadEndpoints();

    this.api = loadedEndpoints.api;
    this.simulatorsApi = loadedEndpoints.simulatorsApi;
    this.combineApi = loadedEndpoints.combineApi;
    this.simdataApi = loadedEndpoints.simdataApi;
    this.externalApi = loadedEndpoints.externalApi;
    this.externalSimulatorsApi = loadedEndpoints.externalSimulatorsApi;
    this.externalCombineApi = loadedEndpoints.externalCombineApi;
    this.externalSimdataApi = loadedEndpoints.externalSimdataApi;
  }
  /* Statistics */
  public getProjectStatisticsEndpoint(): string {
    return `${this.getApiBaseUrl(true)}/statistics`;
  }
  /* HEALTH CHECKS */

  public getApiHealthEndpoint(): string {
    return `${this.getApiBaseUrl(true)}/health/status`;
  }

  public getSimulatorApiHealthEndpoint(): string {
    return `${this.getSimulatorsApiBaseUrl(true)}/health`;
  }

  public getCombineHealthEndpoint(): string {
    return `${this.getCombineApiBaseUrl(true)}/health`;
  }

  public getSimdataHealthEndpoint(): string {
    return `${this.getSimdataApiBaseUrl(true)}/health`;
  }

  // ONTOLOGIES

  /**
   * Get URL for ontologies endpoint
   * @returns The endpoint for the ontologies
   */
  public getOntologyEndpoint(app: string, external: boolean, ontologyId?: string, termId?: string): string {
    const api = this.getOntologiesEndpointBaseUrl(app, external);
    ontologyId ? (ontologyId = `/${ontologyId}`) : (ontologyId = '');
    termId ? (termId = `/${termId}`) : (termId = '');
    if (termId && !ontologyId) {
      throw new Error('Cannot get a term without an ontology id');
    }
    return `${api}${ontologyId}${termId}`;
  }

  /**
   *
   * @returns The endpoint prefix for the ontologies
   */
  public getOntologyTermsEndpoint(app: string, external: boolean): string {
    const api = this.getOntologiesEndpointBaseUrl(app, external);
    return `${api}/terms`;
  }

  /* FILES and FILE CONTENTS */

  /** Get the URL for a file object, for all files for a simulation run, or to post files for a simulation run.
   * @param external Whether the URL should be accessible from outside the local evironment
   * @param runId The id of the simulation run
   * @param fileLocation The location of the file within the COMBINE/OMEX archive for the simulation run
   * @returns The URL to get the content of a COMBINE/OMEX archive
   */
  public getSimulationRunFilesEndpoint(external: boolean, runId?: string, fileLocation?: string): string {
    if (runId) {
      runId = '/' + runId;
      if (fileLocation) {
        fileLocation = '/' + encodeURIComponent(fileLocation);
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
    return `${this.getFilesEndpointBaseUrl(external)}${runId}${fileLocation}`;
  }

  /**
   * Get the endpoint for posting the thumbnails of an image file for a simulation run
   * @param external Whether the URL should be accessible from outside the local evironment
   * @param runId The id of the simulation run
   * @param fileLocation The location of the file within the COMBINE/OMEX archive for the simulation run
   * @returns The URL to post the thumbnails of an image file for a simulation run
   */
  public getSimulationRunThumbnailEndpoint(external: boolean, runId: string, fileLocation: string): string {
    const fileUrl = this.getSimulationRunFilesEndpoint(external, runId, fileLocation);
    return `${fileUrl}/thumbnail`;
  }

  /** Get the URL to download a file in a simulation run
   * @param external Whether the URL should be accessible from outside the local environment
   * @param runId The id of the simulation run
   * @param fileLocation The location of the file within the COMBINE/OMEX archive for the simulation run
   * @param thumbnail The type of resized thumbnail to return of the original file
   * @returns The URL to get the content of a COMBINE/OMEX archive
   */
  public getSimulationRunFilesDownloadEndpoint(
    external: boolean,
    runId?: string,
    fileLocation?: string,
    thumbnail?: Thumbnail,
  ): string {
    const thumbnailQuery = thumbnail ? `?thumbnail=${thumbnail}` : '';

    return `${this.getSimulationRunFilesEndpoint(external, runId, fileLocation)}/download/${thumbnailQuery}`;
  }

  // SIMULATION RUNS
  /**
   *
   * @param id The id of the simulation run
   * @returns The URL to get the simulation run
   */
  public getSimulationRunEndpoint(external: boolean, id?: string): string {
    id ? (id = `/${id}`) : (id = '');
    return `${this.getSimulationRunsEndpointBaseUrl(external)}${id}`;
  }

  /** Create a URL for getting a summary of a simulation run or each run
   *
   * @param id The id of the simulation run
   * @returns URL for getting a summary of a simulation run or each run
   */
  public getSimulationRunSummariesEndpoint(external: boolean, id?: string): string {
    const simulationRuns = this.getSimulationRunsEndpointBaseUrl(external);

    if (id) {
      return `${simulationRuns}/${id}/summary`;
    } else {
      return `${simulationRuns}/summary`;
    }
  }

  /** Create a URL for validating a simulation run
   *
   * @param id The id of the simulation run
   * @returns URL for validating a simulation run
   */
  public getSimulationRunValidationEndpoint(external: boolean, id: string): string {
    const simulationRuns = this.getSimulationRunsEndpointBaseUrl(external);
    return `${simulationRuns}/${id}/validate`;
  }

  // PROJECTS

  /** Get the URL for information about a project or all projects
   * @param id The id of the project
   * @returns URL for information about a project or all projects
   */
  public getProjectsEndpoint(external: boolean, id?: string): string {
    return this.getProjectsEndpointBaseUrl(external) + (id ? `/${id}` : '');
  }

  /** Get the URL for a summary of a project or summaries of each project
   * @param id The id of the project
   * @returns URL for a summary of a project or summaries of each project
   */
  public getProjectSummariesEndpoint(external: boolean, id?: string): string {
    const projects = this.getProjectsEndpointBaseUrl(external);

    if (id) {
      return `${projects}/${id}/summary`;
    } else {
      return `${projects}/summary`;
    }
  }

  /** Get the URL for a summary of a project or summaries of each project
   * @param id The id of the project
   * @returns URL for a summary of a project or summaries of each project
   */
  public getProjectSummariesFilteredEndpoint(external: boolean): string {
    const projects = this.getProjectsEndpointBaseUrl(external);
    return `${projects}/summary_filtered`;
  }

  /** Get the URL for validating a project
   */
  public getValidateProjectEndpoint(external: boolean): string {
    const projects = this.getProjectsEndpointBaseUrl(external);
    return `${projects}/validate`;
  }

  // COMBINE API
  /**
   * Create a URL to add a file to an OMEX file using the COMBINE API
   * @returns A URL for POST endpoint for adding a file to an OMEX file using the COMBINE API
   */
  public getAddFileToCombineArchiveEndpoint(external: boolean): string {
    return this.getCombineFilesEndpointBaseUrl(external);
  }

  /**
   * Create a URL for extracting the inputs and outputs of models
   * @returns A URL for extracting the inputs and outputs of models
   */
  public getModelIntrospectionEndpoint(external: boolean): string {
    const combineApi = this.getCombineApiBaseUrl(external);
    return `${combineApi}/sed-ml/get-parameters-variables-for-simulation`;
  }

  /**
   * Create a URL for creating COMBINE/OMEX archives
   * @returns A URL for creating COMBINE/OMEX archives
   */
  public getCombineArchiveCreationEndpoint(external: boolean): string {
    return `${this.getCombineApiBaseUrl(external)}/combine/create`;
  }

  public getSedmlSpecificationsEndpoint(external: boolean): string {
    return `${this.getCombineApiBaseUrl(external)}/combine/sedml-specs`;
  }

  public getCombineArchiveMetadataEndpoint(external: boolean): string {
    return `${this.getCombineApiBaseUrl(external)}/combine/metadata/biosimulations`;
  }

  public getValidateModelEndpoint(external: boolean): string {
    return `${this.getCombineApiBaseUrl(external)}/model/validate`;
  }

  public getValidateSedmlEndpoint(external: boolean): string {
    return `${this.getCombineApiBaseUrl(external)}/sed-ml/validate`;
  }

  public getValidateOmexMetadataEndpoint(external: boolean): string {
    return `${this.getCombineApiBaseUrl(external)}/omex-metadata/validate`;
  }

  public getValidateCombineArchiveEndpoint(external: boolean): string {
    return `${this.getCombineApiBaseUrl(external)}/combine/validate`;
  }

  public getSimilarAlgorithmsEndpoint(external: boolean): string {
    return `${this.getCombineApiBaseUrl(external)}/kisao/get-similar-algorithms`;
  }

  /**
   *
   * @param id The id of the simulation run
   * @returns A URL to get the metadata of the simulation run
   */
  public getSimulationRunMetadataEndpoint(external: boolean, id?: string): string {
    id ? (id = `/${id}`) : (id = '');
    return `${this.getMetadataEndpointBaseUrl(external)}${id}`;
  }

  /**
   * Returns the URL to download the COMBINE/OMEX archive of a simulation run. The external parameter is used to determine if the
   * returned URL is accessible from outside the current environment.
   * Effectively, if true, then any localhost URLs will be replaced with the dev deployment URLs
   * @param id The id of the simulation run
   * @param external A boolean flag on whether the URL returned should be accessible from outside the current system.
   *
   * @returns A URL to download the COMBINE/OMEX archive of a simulation run
   */
  public getSimulationRunDownloadEndpoint(external: boolean, id: string): string {
    return `${this.getSimulationRunsEndpointBaseUrl(external)}/${id}/download`;
  }

  /**
   * Returns the URL to get the results of  a simulation run. The external parameter is used to determine if the
   * returned URL is accessible from outside the current environment.
   * Effectively, if true, then any localhost URLs will be replaced with the dev deployment URLs
   * @param external A boolean flag on whether the URL returned should be accessible from outside the current system.
   * @param runId The id of the simulation run
   * @param experimentLocationAndOutputId The id of the result output
   * @param includeData How the includeData param should be set on the URL
   *
   * @returns A URL to retrieve the results of a simulation run
   */
  public getRunResultsEndpoint(
    external: boolean,
    runId?: string,
    experimentLocationAndOutputId?: string,
    includeData = false,
  ): string {
    runId ? (runId = `/${encodeURIComponent(runId)}`) : (runId = '');
    experimentLocationAndOutputId
      ? (experimentLocationAndOutputId = `/${encodeURIComponent(experimentLocationAndOutputId)}`)
      : (experimentLocationAndOutputId = '');
    if (experimentLocationAndOutputId && !runId) {
      throw new Error('Cannot get results of an output without an id');
    }

    return `${this.getResultsEndpointBaseUrl(
      external,
    )}${runId}${experimentLocationAndOutputId}?includeData=${includeData}`;
  }

  /**
   *
   * @param id The id of the simulation run
   * @param external A boolean flag on whether the URL returned should be accessible from outside the current system.
   * @returns A URL to download the output of a simulation
   */
  public getRunResultsDownloadEndpoint(external: boolean, id: string): string {
    return `${this.getResultsEndpointBaseUrl(external)}/${id}/download`;
  }

  /**
   *
   * @param external A boolean flag on whether the URL returned should be accessible from outside the current system.
   * @param runId The id of the simulation run
   * @param experimentLocation The local of the particular simulation spec (SED-ML file )
   * @param elementType The sedml element type (e.g. "SedModel", "SedSimulation", "SedOutput")
   * @param elementId The id of the sedml element
   * @returns The URL to the specified simulation spec
   */
  public getSimulationRunSimulationExperimentSpecificationsEndpoint(
    external: boolean,
    runId?: string,
    experimentLocation?: string,
    elementType?: string, // SedElementType
    elementId?: string,
  ): string {
    runId ? (runId = `/${runId}`) : (runId = '');
    experimentLocation ? (experimentLocation = `/${experimentLocation}`) : (experimentLocation = '');

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
      throw new Error('Cannot get a specific element without an experiment location');
    }
    if (elementId && !elementType) {
      throw new Error('Cannot get a specific element without a type');
    }
    if (elementType && !elementId) {
      throw new Error('Cannot get a specific element without an id');
    }

    return `${this.getSpecificationsEndpointBaseUrl(
      external,
    )}${runId}${experimentLocation}${elementTypePath}${elementId}`;
  }

  public getSimulationRunLogsEndpoint(external: boolean, id?: string): string {
    id ? (id = `/${id}`) : (id = '');
    return `${this.getLogsEndpointBaseUrl(external)}${id}`;
  }

  /**
   *
   * @param id The id of the simulator
   * @param version The version of the simulator
   * @param includeTests Whether to include the results of the validation tests
   * @returns  A URL to get the simulators, and specific simulator, or a specific version of a simulator
   */
  public getSimulatorsEndpoint(external: boolean, id?: string, version?: string, includeTests = false): string {
    id ? (id = `/${id}`) : (id = '');
    version ? (version = `/${version}`) : (version = '');
    const tests = includeTests ? '?includeTests=true' : '';
    return `${this.getSimulatorsEndpointBaseUrl(external)}${id}${version}${tests}`;
  }

  /**
   *
   * @param includeTests Whether to include the results of the validation tests
   * @returns  A URL to get the latest version of each simulator, or the latest version of a specific simulator
   */
  public getLatestSimulatorsEndpoint(external: boolean, includeTests = false): string {
    const tests = includeTests ? '?includeTests=true' : '';
    return `${this.getSimulatorsApiBaseUrl(external)}/simulators/latest${tests}`;
  }

  /* BASE URLS
     base URLs for the backend services depending on the "external" parameter */

  public getApiBaseUrl(external: boolean): string {
    return external ? this.externalApi : this.api;
  }

  public getSimulatorsApiBaseUrl(external: boolean): string {
    return external ? this.externalSimulatorsApi : this.simulatorsApi;
  }

  public getCombineApiBaseUrl(external: boolean): string {
    return external ? this.externalCombineApi : this.combineApi;
  }

  public getSimdataApiBaseUrl(external: boolean): string {
    return external ? this.externalSimdataApi : this.simdataApi;
  }

  private getOntologiesEndpointBaseUrl(app: string, external: boolean): string {
    const api = app === 'simulators' ? this.getSimulatorsApiBaseUrl(external) : this.getApiBaseUrl(external);
    return `${api}/ontologies`;
  }

  private getFilesEndpointBaseUrl(external: boolean): string {
    const api = this.getApiBaseUrl(external);
    return `${api}/files`;
  }

  private getLogsEndpointBaseUrl(external: boolean): string {
    const api = this.getApiBaseUrl(external);
    return `${api}/logs`;
  }

  private getResultsEndpointBaseUrl(external: boolean): string {
    const api = this.getApiBaseUrl(external);
    return `${api}/results`;
  }

  private getMetadataEndpointBaseUrl(external: boolean): string {
    const api = this.getApiBaseUrl(external);
    return `${api}/metadata`;
  }

  private getSimulationRunsEndpointBaseUrl(external: boolean): string {
    const api = this.getApiBaseUrl(external);
    return `${api}/runs`;
  }

  private getSpecificationsEndpointBaseUrl(external: boolean): string {
    const api = this.getApiBaseUrl(external);
    return `${api}/specifications`;
  }
  private getProjectsEndpointBaseUrl(external: boolean): string {
    const api = this.getApiBaseUrl(external);
    return `${api}/projects`;
  }

  private getSimulatorsEndpointBaseUrl(external: boolean): string {
    const api = this.getSimulatorsApiBaseUrl(external);
    return `${api}/simulators`;
  }

  private getCombineFilesEndpointBaseUrl(external: boolean): string {
    const api = this.getCombineApiBaseUrl(external);
    return `${api}/combine/file`;
  }
}
