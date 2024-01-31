import { environment, envs } from '@biosimulations/shared/environments';
import { EndpointLoader, LoadedEndpoints } from './endpointLoader';

export class AppRoutes {
  public simulatorsApp: string;
  public dispatchApp: string;
  public platformApp: string;

  public constructor(env?: envs) {
    // We can read the env that is provided in the shared environment file as the default
    if (env == undefined) {
      env = environment.env;
    }

    const endpointLoader = new EndpointLoader(env);
    const loadedEndpoints: LoadedEndpoints = endpointLoader.loadEndpoints();

    this.simulatorsApp = loadedEndpoints.simulatorsApp;
    this.dispatchApp = loadedEndpoints.dispatchApp;
    this.platformApp = loadedEndpoints.platformApp;
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
    version ? (version = `/${version}`) : (version = '');
    if (version && !id) {
      throw new Error('Cannot get a version without a simulator id');
    }
    return `${this.simulatorsApp}/simulators${id}${version}`;
  }

  public getSimulationRunsView(id?: string): string {
    id ? (id = `/${id}`) : (id = '');
    //return `${this.platformApp}/runs${id}`;
    return `${this.dispatchApp}/runs${id}`;
  }

  public getProjectsView(id?: string): string {
    id ? (id = `/${id}`) : (id = '');
    return `${this.platformApp}/projects${id}`;
  }

  public getConventionsView(page?: string): string {
    page ? (page = `${page}/`) : (page = '');
    return `https://docs.biosimulations.org/concepts/conventions/${page}`;
  }
}
