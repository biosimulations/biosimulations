import { Environment } from './environment.type';
import { deployment } from './deployment/deployment';
import { biosimulationsApiEndpoints } from './biosimulations-api-endpoints/biosimulations-api-endpoints';
import { biosimulationsApiEndpoints as externalBiosimulationsApiEndpoints } from './biosimulations-api-endpoints/biosimulations-api-endpoints.external';
import { biosimulationsAppEndpoints } from './biosimulations-app-endpoints/biosimulations-app-endpoints';
import { filesApiEndpoint } from './files-api-endpoint/files-api-endpoint';
import { dataApiEndpoint } from './data-api-endpoint/data-api-endpoint';
import { dataApiEndpoint as externalDataApiEndpoint } from './data-api-endpoint/data-api-endpoint.external';

export const environment: Environment = {
  ...deployment,
  biosimulationsApiEndpoints,
  externalBiosimulationsApiEndpoints,
  biosimulationsAppEndpoints,
  filesApiEndpoint,
  dataApiEndpoint,
  externalDataApiEndpoint,
};
