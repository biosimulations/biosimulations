import { Deployment } from './deployment/deployment.type';
import { BiosimulationsApiEndpoints } from './biosimulations-api-endpoints/biosimulations-api-endpoints.type';
import { BiosimulationsAppEndpoints } from './biosimulations-app-endpoints/biosimulations-app-endpoints.type';
import { FilesApiEndpoint } from './files-api-endpoint/files-api-endpoint.type';
import { DataApiEndpoint } from './data-api-endpoint/data-api-endpoint.type';

export type Environment = Deployment & {
  biosimulationsApiEndpoints: BiosimulationsApiEndpoints;
  externalBiosimulationsApiEndpoints: BiosimulationsApiEndpoints;
  biosimulationsAppEndpoints: BiosimulationsAppEndpoints;
  filesApiEndpoint: FilesApiEndpoint;
  dataApiEndpoint: DataApiEndpoint;
  externalDataApiEndpoint: DataApiEndpoint;
}