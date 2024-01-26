import { envs } from '@biosimulations/shared/environments';

/* eslint-disable max-len */
export type Endpoint =
  | 'api'
  | 'simulatorsApi'
  | 'combineApi'
  | 'simdataApi'
  | 'externalApi'
  | 'externalSimulatorsApi'
  | 'externalCombineApi'
  | 'externalSimdataApi'
  | 'simulatorsApp'
  | 'dispatchApp'
  | 'platformApp';

export type DynamicEndpoints = { [key in Endpoint]: string | undefined };
export type LoadedEndpoints = { [key in Endpoint]: string };

export class EndpointLoader {
  public useDevRuns = true;
  private endpointPointers = {
    prod: '.org',
    dev: '.dev',
    localHostPort: '3333',
  };
  private endpointsTemplate: LoadedEndpoints = {
    api: 'api',
    simulatorsApi: 'simulatorsApi',
    combineApi: 'combineApi',
    simdataApi: 'simdataApi',
    externalApi: 'externalApi',
    externalSimulatorsApi: 'externalSimulatorsApi',
    externalCombineApi: 'externalCombineApi',
    externalSimdataApi: 'externalSimdataApi',
    simulatorsApp: 'simulatorsApp',
    dispatchApp: 'dispatchApp',
    platformApp: 'platformApp',
  };
  private env: envs;

  public constructor(env: envs) {
    this.env = env;
  }

  public loadEndpoints(): LoadedEndpoints {
    const dynamicEndpoints = this.getDynamicEndpoints();
    this.setDispatchAppEndpoints();
    switch (this.env) {
      case 'local':
        this.endpointsTemplate.api = dynamicEndpoints?.api || 'http://localhost:' + this.endpointPointers.localHostPort;

        this.endpointsTemplate.simulatorsApi = dynamicEndpoints?.simulatorsApi || 'https://api.biosimulators.dev';

        this.endpointsTemplate.combineApi = dynamicEndpoints?.combineApi || 'https://combine.api.biosimulations.dev';

        this.endpointsTemplate.simdataApi = dynamicEndpoints?.simdataApi || 'https://data.biosimulations.dev';

        this.endpointsTemplate.simulatorsApp = dynamicEndpoints?.simulatorsApp || 'https://biosimulators.dev';

        this.endpointsTemplate.platformApp = dynamicEndpoints?.platformApp || 'https://biosimulations.dev';

        this.endpointsTemplate.externalApi = dynamicEndpoints?.externalApi || 'https://api.biosimulations.dev';

        this.endpointsTemplate.externalSimulatorsApi =
          dynamicEndpoints?.externalSimulatorsApi || 'https://api.biosimulators.dev';

        this.endpointsTemplate.externalCombineApi =
          dynamicEndpoints?.externalCombineApi || 'https://combine.api.biosimulations.dev';

        this.endpointsTemplate.externalSimdataApi =
          dynamicEndpoints?.externalSimdataApi || 'https://data.biosimulations.dev';
        break;

      case 'dev':
        this.endpointsTemplate.api = dynamicEndpoints?.api || 'https://api.biosimulations.dev';

        this.endpointsTemplate.simulatorsApi = dynamicEndpoints?.simulatorsApi || 'https://api.biosimulators.dev';

        this.endpointsTemplate.combineApi = dynamicEndpoints?.combineApi || 'https://combine.api.biosimulations.dev';

        this.endpointsTemplate.simdataApi = dynamicEndpoints?.simdataApi || 'https://data.biosimulations.dev';

        this.endpointsTemplate.simulatorsApp = dynamicEndpoints?.simulatorsApp || 'https://biosimulators.dev';

        this.endpointsTemplate.platformApp = dynamicEndpoints?.platformApp || 'https://biosimulations.dev';

        this.endpointsTemplate.externalApi = dynamicEndpoints?.externalApi || 'https://api.biosimulations.dev';

        this.endpointsTemplate.externalSimulatorsApi =
          dynamicEndpoints?.externalSimulatorsApi || 'https://api.biosimulators.dev';

        this.endpointsTemplate.externalCombineApi =
          dynamicEndpoints?.externalCombineApi || 'https://combine.api.biosimulations.dev';

        this.endpointsTemplate.externalSimdataApi =
          dynamicEndpoints?.externalSimdataApi || 'https://data.biosimulations.dev';

        break;

      case 'stage':
        this.endpointsTemplate.api = dynamicEndpoints?.api || 'https://api.biosimulations.dev';

        this.endpointsTemplate.simulatorsApi = dynamicEndpoints?.simulatorsApi || 'https://api.biosimulators.dev';

        this.endpointsTemplate.combineApi = dynamicEndpoints?.combineApi || 'https://combine.api.biosimulations.dev';

        this.endpointsTemplate.simdataApi = dynamicEndpoints?.simdataApi || 'https://data.biosimulations.dev';

        this.endpointsTemplate.simulatorsApp = dynamicEndpoints?.simulatorsApp || 'https://biosimulators.dev';

        this.endpointsTemplate.platformApp = dynamicEndpoints?.platformApp || 'https://biosimulations.dev';

        this.endpointsTemplate.externalApi = dynamicEndpoints?.externalApi || 'https://api.biosimulations.dev';

        this.endpointsTemplate.externalSimulatorsApi =
          dynamicEndpoints?.externalSimulatorsApi || 'https://api.biosimulators.dev';

        this.endpointsTemplate.externalCombineApi =
          dynamicEndpoints?.externalCombineApi || 'https://combine.api.biosimulations.dev';

        this.endpointsTemplate.externalSimdataApi =
          dynamicEndpoints?.externalSimdataApi || 'https://data.biosimulations.dev';

        break;

      case 'prod':
        this.endpointsTemplate.api = dynamicEndpoints?.api || 'https://api.biosimulations.org';

        this.endpointsTemplate.simulatorsApi = dynamicEndpoints?.simulatorsApi || 'https://api.biosimulators.org';

        this.endpointsTemplate.combineApi = dynamicEndpoints?.combineApi || 'https://combine.api.biosimulations.org';

        this.endpointsTemplate.simdataApi = dynamicEndpoints?.simdataApi || 'https://data.biosimulations.org';

        this.endpointsTemplate.simulatorsApp = dynamicEndpoints?.simulatorsApp || 'https://biosimulators.org';

        this.endpointsTemplate.platformApp = dynamicEndpoints?.platformApp || 'https://biosimulations.org';

        this.endpointsTemplate.dispatchApp = 'https://run.biosimulations.org';

        this.endpointsTemplate.externalApi = dynamicEndpoints?.externalApi || 'https://api.biosimulations.org';

        this.endpointsTemplate.externalSimulatorsApi =
          dynamicEndpoints?.externalSimulatorsApi || 'https://api.biosimulators.org';

        this.endpointsTemplate.externalCombineApi =
          dynamicEndpoints?.externalCombineApi || 'https://combine.api.biosimulations.org';

        this.endpointsTemplate.externalSimdataApi =
          dynamicEndpoints?.externalSimdataApi || 'https://data.biosimulations.org';

        break;
    }
    console.log(this.endpointsTemplate.dispatchApp);
    return this.endpointsTemplate;
  }

  private getDynamicEndpoints(): DynamicEndpoints | undefined {
    /* If the code is running in a browser, we cannot load the environment variables, and must use hard-coded values */
    const isBrowser = typeof window !== 'undefined';
    let dynamicEndpoints;

    if (!isBrowser) {
      dynamicEndpoints = {
        api: process.env.API_URL,
        simulatorsApi: process.env.SIMULATORS_API_URL,
        combineApi: process.env.COMBINE_API_URL,
        simdataApi: process.env.SIMDATA_API_URL,

        externalApi: process.env.EXTERNAL_API_URL,
        externalSimulatorsApi: process.env.EXTERNAL_SIMULATORS_API_URL,
        externalCombineApi: process.env.EXTERNAL_COMBINE_API_URL,
        externalSimdataApi: process.env.EXTERNAL_SIMDATA_API_URL,

        simulatorsApp: process.env.SIMULATORS_APP_URL,
        dispatchApp: process.env.DISPATCH_APP_URL,
        platformApp: process.env.PLATFORM_APP_URL,
      };
    }

    return dynamicEndpoints;
  }

  private _handleEndpoint(root: string, condition: boolean): string {
    const pointer = condition ? this.endpointPointers.dev : this.endpointPointers.prod;
    return root + pointer;
  }

  private handleDispatchAppEndpoint(endpointRoot = 'https://run.biosimulations'): string {
    return this._handleEndpoint(endpointRoot, this.useDevRuns);
  }

  private setDispatchAppEndpoints(): void {
    this.endpointsTemplate.dispatchApp = this.handleDispatchAppEndpoint();
  }
}
