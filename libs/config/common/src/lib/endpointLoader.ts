/* eslint-disable max-len */
export type Endpoint =
  | 'api'
  | 'simulatorsApi'
  | 'combineApi'
  | 'storageEndpoint'
  | 'dataService'
  | 'externalApi'
  | 'externalSimulatorsApi'
  | 'externalCombineApi'
  | 'externalStorageEndpoint'
  | 'externalDataService'
  | 'simulatorsApp'
  | 'dispatchApp'
  | 'platformApp';

export type DynamicEndpoints = { [key in Endpoint]: string | undefined };
export type LoadedEndpoints = { [key in Endpoint]: string };

export class EndpointLoader {
  private env: 'local' | 'dev' | 'stage' | 'prod';

  public constructor(env: 'local' | 'dev' | 'stage' | 'prod') {
    this.env = env;
  }

  public loadEndpoints(): LoadedEndpoints {
    const dynamicEndpoints = this.getDynamicEndpoints();

    const defaultEndpoints: LoadedEndpoints = {
      api: 'https://api.biosimulations.dev',
      simulatorsApi: 'https://api.biosimulators.dev',
      combineApi: 'https://combine.api.biosimulations.dev',
      storageEndpoint: 'https://files-dev.biosimulations.org',
      dataService: 'https://data.biosimulations.dev',
      externalApi: 'https://api.biosimulations.dev',
      externalSimulatorsApi: 'https://api.biosimulators.dev',
      externalCombineApi: 'https://combine.api.biosimulations.dev',
      externalStorageEndpoint: 'https://files-dev.biosimulations.org',
      externalDataService: 'https://data.biosimulations.dev',
      simulatorsApp: 'https://biosimulatiors.dev',
      dispatchApp: 'https://run.biosimulations.dev',
      platformApp: 'https://biosimulations.dev',
    };

    switch (this.env) {
      case 'local':
        defaultEndpoints.api = dynamicEndpoints?.api || 'http://localhost:3333';

        defaultEndpoints.simulatorsApi =
          dynamicEndpoints?.simulatorsApi || 'https://api.biosimulators.dev';

        defaultEndpoints.combineApi =
          dynamicEndpoints?.combineApi ||
          'https://combine.api.biosimulations.dev';

        defaultEndpoints.storageEndpoint =
          dynamicEndpoints?.storageEndpoint ||
          'https://files-dev.biosimulations.org/s3';

        defaultEndpoints.simulatorsApp =
          dynamicEndpoints?.simulatorsApp || 'https://biosimulators.dev';

        defaultEndpoints.dispatchApp =
          dynamicEndpoints?.dispatchApp || 'https://run.biosimulations.dev';

        defaultEndpoints.platformApp =
          dynamicEndpoints?.platformApp || 'https://biosimulations.dev';

        defaultEndpoints.dataService =
          dynamicEndpoints?.dataService || 'https://data.biosimulations.dev';

        defaultEndpoints.externalApi =
          dynamicEndpoints?.externalApi || 'https://api.biosimulations.dev';

        defaultEndpoints.externalSimulatorsApi =
          dynamicEndpoints?.externalSimulatorsApi ||
          'https://api.biosimulators.dev';

        defaultEndpoints.externalCombineApi =
          dynamicEndpoints?.externalCombineApi ||
          'https://combine.api.biosimulations.dev';

        defaultEndpoints.externalStorageEndpoint =
          dynamicEndpoints?.externalStorageEndpoint ||
          'https://files-dev.biosimulations.org/s3';

        defaultEndpoints.externalDataService =
          dynamicEndpoints?.externalDataService ||
          'https://data.biosimulations.dev';
        break;

      case 'dev':
        defaultEndpoints.api =
          dynamicEndpoints?.api || 'https://api.biosimulations.dev';

        defaultEndpoints.simulatorsApi =
          dynamicEndpoints?.simulatorsApi || 'https://api.biosimulators.dev';

        defaultEndpoints.combineApi =
          dynamicEndpoints?.combineApi ||
          'https://combine.api.biosimulations.dev';

        defaultEndpoints.storageEndpoint =
          dynamicEndpoints?.storageEndpoint ||
          'https://files-dev.biosimulations.org/s3';

        defaultEndpoints.simulatorsApp =
          dynamicEndpoints?.simulatorsApp || 'https://biosimulators.dev';

        defaultEndpoints.dispatchApp =
          dynamicEndpoints?.dispatchApp || 'https://run.biosimulations.dev';

        defaultEndpoints.platformApp =
          dynamicEndpoints?.platformApp || 'https://biosimulations.dev';

        defaultEndpoints.dataService =
          dynamicEndpoints?.dataService || 'https://data.biosimulations.dev';

        defaultEndpoints.externalApi =
          dynamicEndpoints?.externalApi || 'https://api.biosimulations.dev';

        defaultEndpoints.externalSimulatorsApi =
          dynamicEndpoints?.externalSimulatorsApi ||
          'https://api.biosimulators.dev';

        defaultEndpoints.externalCombineApi =
          dynamicEndpoints?.externalCombineApi ||
          'https://combine.api.biosimulations.dev';

        defaultEndpoints.externalStorageEndpoint =
          dynamicEndpoints?.externalStorageEndpoint ||
          'https://files-dev.biosimulations.org/s3';

        defaultEndpoints.externalDataService =
          dynamicEndpoints?.externalDataService ||
          'https://data.biosimulations.dev';

        break;

      case 'stage':
        defaultEndpoints.api =
          dynamicEndpoints?.api || 'https://api.biosimulations.dev';

        defaultEndpoints.simulatorsApi =
          dynamicEndpoints?.simulatorsApi || 'https://api.biosimulators.dev';

        defaultEndpoints.combineApi =
          dynamicEndpoints?.combineApi ||
          'https://combine.api.biosimulations.dev';

        defaultEndpoints.storageEndpoint =
          dynamicEndpoints?.storageEndpoint ||
          'https://files-dev.biosimulations.org/s3';

        defaultEndpoints.simulatorsApp =
          dynamicEndpoints?.simulatorsApp || 'https://biosimulators.dev';

        defaultEndpoints.dispatchApp =
          dynamicEndpoints?.dispatchApp || 'https://run.biosimulations.dev';

        defaultEndpoints.platformApp =
          dynamicEndpoints?.platformApp || 'https://biosimulations.dev';

        defaultEndpoints.dataService =
          dynamicEndpoints?.dataService || 'https://data.biosimulations.dev';

        defaultEndpoints.externalApi =
          dynamicEndpoints?.externalApi || 'https://api.biosimulations.dev';

        defaultEndpoints.externalSimulatorsApi =
          dynamicEndpoints?.externalSimulatorsApi ||
          'https://api.biosimulators.dev';

        defaultEndpoints.externalCombineApi =
          dynamicEndpoints?.externalCombineApi ||
          'https://combine.api.biosimulations.dev';

        defaultEndpoints.externalStorageEndpoint =
          dynamicEndpoints?.externalStorageEndpoint ||
          'https://files-dev.biosimulations.org/s3';

        defaultEndpoints.externalDataService =
          dynamicEndpoints?.externalDataService ||
          'https://data.biosimulations.dev';
        break;

      case 'prod':
        defaultEndpoints.api =
          dynamicEndpoints?.api || 'https://api.biosimulations.org';

        defaultEndpoints.simulatorsApi =
          dynamicEndpoints?.simulatorsApi || 'https://api.biosimulators.org';

        defaultEndpoints.combineApi =
          dynamicEndpoints?.combineApi ||
          'https://combine.api.biosimulations.org';

        defaultEndpoints.storageEndpoint =
          dynamicEndpoints?.storageEndpoint ||
          'https://files.biosimulations.org/s3';

        defaultEndpoints.simulatorsApp =
          dynamicEndpoints?.simulatorsApp || 'https://biosimulators.org';

        defaultEndpoints.dispatchApp =
          dynamicEndpoints?.dispatchApp || 'https://run.biosimulations.org';

        defaultEndpoints.platformApp =
          dynamicEndpoints?.platformApp || 'https://biosimulations.org';

        defaultEndpoints.dataService =
          dynamicEndpoints?.dataService || 'https://data.biosimulations.org';

        defaultEndpoints.externalApi =
          dynamicEndpoints?.externalApi || 'https://api.biosimulations.org';

        defaultEndpoints.externalSimulatorsApi =
          dynamicEndpoints?.externalSimulatorsApi ||
          'https://api.biosimulators.org';

        defaultEndpoints.externalCombineApi =
          dynamicEndpoints?.externalCombineApi ||
          'https://combine.api.biosimulations.org';

        defaultEndpoints.externalStorageEndpoint =
          dynamicEndpoints?.externalStorageEndpoint ||
          'https://files.biosimulations.org/s3';

        defaultEndpoints.externalDataService =
          dynamicEndpoints?.externalDataService ||
          'https://data.biosimulations.org';
        break;
    }
    return defaultEndpoints;
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
        storageEndpoint: process.env.STORAGE_URL,
        dataService: process.env.DATA_SERVICE_URL,

        externalApi: process.env.EXTERNAL_API_URL,
        externalSimulatorsApi: process.env.EXTERNAL_SIMULATORS_API_URL,
        externalCombineApi: process.env.EXTERNAL_COMBINE_API_URL,
        externalStorageEndpoint: process.env.EXTERNAL_STORAGE_URL,
        externalDataService: process.env.EXTERNAL_DATA_SERVICE_URL,

        simulatorsApp: process.env.SIMULATORS_APP_URL,
        dispatchApp: process.env.DISPATCH_APP_URL,
        platformApp: process.env.PLATFORM_APP_URL,
      };
    }
    return dynamicEndpoints;
  }
}
