import { envs } from '@biosimulations/shared/environments';

/* eslint-disable max-len */
export type Endpoint =
  | 'api'
  | 'simulatorsApi'
  | 'combineApi'
  | 'dataService'
  | 'externalApi'
  | 'externalSimulatorsApi'
  | 'externalCombineApi'
  | 'externalDataService'
  | 'simulatorsApp'
  | 'dispatchApp'
  | 'platformApp';

export type DynamicEndpoints = { [key in Endpoint]: string | undefined };
export type LoadedEndpoints = { [key in Endpoint]: string };

export class EndpointLoader {
  public useDevRuns = false;
  private endpointPointers = {
    prod: '.org',
    dev: '.dev',
    localHostPort: '3333',
  };
  private env: envs;

  public constructor(env: envs) {
    this.env = env;
  }

  public loadEndpoints(): LoadedEndpoints {
    const dynamicEndpoints = this.getDynamicEndpoints();

    const endpointsTemplate: LoadedEndpoints = {
      api: 'api',
      simulatorsApi: 'simulatorsApi',
      combineApi: 'combineApi',
      dataService: 'dataService',
      externalApi: 'externalApi',
      externalSimulatorsApi: 'externalSimulatorsApi',
      externalCombineApi: 'externalCombineApi',
      externalDataService: 'externalDataService',
      simulatorsApp: 'simulatorsApp',
      dispatchApp: 'dispatchApp',
      platformApp: 'platformApp',
    };

    switch (this.env) {
      case 'local':
        endpointsTemplate.api = dynamicEndpoints?.api || 'http://localhost:' + this.endpointPointers.localHostPort;

        endpointsTemplate.simulatorsApi = dynamicEndpoints?.simulatorsApi || 'https://api.biosimulators.dev';

        endpointsTemplate.combineApi = dynamicEndpoints?.combineApi || 'https://combine.api.biosimulations.dev';

        endpointsTemplate.simulatorsApp = dynamicEndpoints?.simulatorsApp || 'https://biosimulators.dev';

        endpointsTemplate.dispatchApp = dynamicEndpoints?.dispatchApp || 'https://run.biosimulations.dev';

        endpointsTemplate.platformApp = dynamicEndpoints?.platformApp || 'https://biosimulations.dev';

        endpointsTemplate.dataService = dynamicEndpoints?.dataService || 'https://data.biosimulations.dev';

        endpointsTemplate.externalApi = dynamicEndpoints?.externalApi || 'https://api.biosimulations.dev';

        endpointsTemplate.externalSimulatorsApi =
          dynamicEndpoints?.externalSimulatorsApi || 'https://api.biosimulators.dev';

        endpointsTemplate.externalCombineApi =
          dynamicEndpoints?.externalCombineApi || 'https://combine.api.biosimulations.dev';

        endpointsTemplate.externalDataService =
          dynamicEndpoints?.externalDataService || 'https://data.biosimulations.dev';
        break;

      case 'dev':
        endpointsTemplate.api = dynamicEndpoints?.api || 'https://api.biosimulations.dev';

        endpointsTemplate.simulatorsApi = dynamicEndpoints?.simulatorsApi || 'https://api.biosimulators.dev';

        endpointsTemplate.combineApi = dynamicEndpoints?.combineApi || 'https://combine.api.biosimulations.dev';

        endpointsTemplate.simulatorsApp = dynamicEndpoints?.simulatorsApp || 'https://biosimulators.dev';

        endpointsTemplate.dispatchApp = this.handleRunEndpoint();

        endpointsTemplate.platformApp = dynamicEndpoints?.platformApp || 'https://biosimulations.dev';

        endpointsTemplate.dataService = dynamicEndpoints?.dataService || 'https://data.biosimulations.dev';

        endpointsTemplate.externalApi = dynamicEndpoints?.externalApi || 'https://api.biosimulations.dev';

        endpointsTemplate.externalSimulatorsApi =
          dynamicEndpoints?.externalSimulatorsApi || 'https://api.biosimulators.dev';

        endpointsTemplate.externalCombineApi =
          dynamicEndpoints?.externalCombineApi || 'https://combine.api.biosimulations.dev';

        endpointsTemplate.externalDataService =
          dynamicEndpoints?.externalDataService || 'https://data.biosimulations.dev';

        break;

      case 'stage':
        endpointsTemplate.api = dynamicEndpoints?.api || 'https://api.biosimulations.dev';

        endpointsTemplate.simulatorsApi = dynamicEndpoints?.simulatorsApi || 'https://api.biosimulators.dev';

        endpointsTemplate.combineApi = dynamicEndpoints?.combineApi || 'https://combine.api.biosimulations.dev';

        endpointsTemplate.simulatorsApp = dynamicEndpoints?.simulatorsApp || 'https://biosimulators.dev';

        endpointsTemplate.dispatchApp = this.handleRunEndpoint();

        endpointsTemplate.platformApp = dynamicEndpoints?.platformApp || 'https://biosimulations.dev';

        endpointsTemplate.dataService = dynamicEndpoints?.dataService || 'https://data.biosimulations.dev';

        endpointsTemplate.externalApi = dynamicEndpoints?.externalApi || 'https://api.biosimulations.dev';

        endpointsTemplate.externalSimulatorsApi =
          dynamicEndpoints?.externalSimulatorsApi || 'https://api.biosimulators.dev';

        endpointsTemplate.externalCombineApi =
          dynamicEndpoints?.externalCombineApi || 'https://combine.api.biosimulations.dev';

        endpointsTemplate.externalDataService =
          dynamicEndpoints?.externalDataService || 'https://data.biosimulations.dev';
        break;

      case 'prod':
        endpointsTemplate.api = dynamicEndpoints?.api || 'https://api.biosimulations.org';

        endpointsTemplate.simulatorsApi = dynamicEndpoints?.simulatorsApi || 'https://api.biosimulators.org';

        endpointsTemplate.combineApi = dynamicEndpoints?.combineApi || 'https://combine.api.biosimulations.org';

        endpointsTemplate.simulatorsApp = dynamicEndpoints?.simulatorsApp || 'https://biosimulators.org';

        endpointsTemplate.dispatchApp = dynamicEndpoints?.dispatchApp || 'https://run.biosimulations.org';

        endpointsTemplate.platformApp = dynamicEndpoints?.platformApp || 'https://biosimulations.org';

        endpointsTemplate.dataService = dynamicEndpoints?.dataService || 'https://data.biosimulations.org';

        endpointsTemplate.externalApi = dynamicEndpoints?.externalApi || 'https://api.biosimulations.org';

        endpointsTemplate.externalSimulatorsApi =
          dynamicEndpoints?.externalSimulatorsApi || 'https://api.biosimulators.org';

        endpointsTemplate.externalCombineApi =
          dynamicEndpoints?.externalCombineApi || 'https://combine.api.biosimulations.org';

        endpointsTemplate.externalDataService =
          dynamicEndpoints?.externalDataService || 'https://data.biosimulations.org';
        break;
    }
    return endpointsTemplate;
  }

  private getDynamicEndpoints(): DynamicEndpoints | undefined {
    // If the code is running in a browser, we cannot load the environment variables, and must use hard-coded values
    const isBrowser = typeof window !== 'undefined';
    let dynamicEndpoints;

    if (!isBrowser) {
      dynamicEndpoints = {
        api: process.env.API_URL,
        simulatorsApi: process.env.SIMULATORS_API_URL,
        combineApi: process.env.COMBINE_API_URL,
        dataService: process.env.DATA_SERVICE_URL,

        externalApi: process.env.EXTERNAL_API_URL,
        externalSimulatorsApi: process.env.EXTERNAL_SIMULATORS_API_URL,
        externalCombineApi: process.env.EXTERNAL_COMBINE_API_URL,
        externalDataService: process.env.EXTERNAL_DATA_SERVICE_URL,

        simulatorsApp: process.env.SIMULATORS_APP_URL,
        dispatchApp: process.env.DISPATCH_APP_URL,
        platformApp: process.env.PLATFORM_APP_URL,
      };
    }
    return dynamicEndpoints;
  }

  private handleEndpoint(root: string, condition: boolean): string {
    return root + (condition ? this.endpointPointers.dev : this.endpointPointers.prod);
  }

  private handleRunEndpoint(endpointRoot = 'https://run.biosimulations'): string {
    return this.handleEndpoint(endpointRoot, this.useDevRuns);
  }
}
