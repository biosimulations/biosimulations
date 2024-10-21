import {
  devEndpoints as devEndpointConfigs,
  endpointType,
  envs,
  localEndpoints as localEndpointConfigs,
  prodEndpoints as prodEndpointConfigs,
  stageEndpoints as stageEndpointConfigs,
} from '@biosimulations/shared/environments';
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

// export type DynamicEndpoints = { [key in Endpoint]: string | undefined };
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
    // const dynamicEndpoints = this.getDynamicEndpoints();
    this.setDispatchAppEndpoints();
    switch (this.env) {
      case 'prod':
        return this.setEndpoints(prodEndpointConfigs);
      case 'stage':
        return this.setEndpoints(stageEndpointConfigs);
      case 'local':
        return this.setEndpoints(localEndpointConfigs);
      case 'dev':
        return this.setEndpoints(devEndpointConfigs);
      default:
        return this.endpointsTemplate;
    }
  }

  private setEndpoints(endpointConfigs: endpointType): LoadedEndpoints {
    this.endpointsTemplate.api = endpointConfigs.api;
    this.endpointsTemplate.simulatorsApi = endpointConfigs.simulators_api;
    this.endpointsTemplate.combineApi = endpointConfigs.combine_api;
    this.endpointsTemplate.simdataApi = endpointConfigs.simdata_api;
    this.endpointsTemplate.externalApi = endpointConfigs.external_api;
    this.endpointsTemplate.externalSimulatorsApi = endpointConfigs.external_simulators_api;
    this.endpointsTemplate.externalCombineApi = endpointConfigs.external_combine_api;
    this.endpointsTemplate.externalSimdataApi = endpointConfigs.external_simdata_api;
    this.endpointsTemplate.simulatorsApp = endpointConfigs.simulators_app;
    this.endpointsTemplate.platformApp = endpointConfigs.platform_app;
    this.endpointsTemplate.dispatchApp = endpointConfigs.dispatch_app;
    return this.endpointsTemplate;
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
