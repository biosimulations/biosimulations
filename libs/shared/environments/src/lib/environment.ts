import { environmentType } from './environment.type';
import { endpointType } from './endpoint.type';

/* Change the name of the file to environment.type.ts where type is the name of the environment you wish to load */
import { environment as devEnvironmentConfig, endpoints as devEndpointsConfig } from './environment.dev';
export const devEnvironment: environmentType = devEnvironmentConfig;
export const devEndpoints: endpointType = devEndpointsConfig;

import { environment as prodEnvironmentConfig, endpoints as prodEndpointsConfig } from './environment.prod';
export const prodEnvironment: environmentType = prodEnvironmentConfig;
export const prodEndpoints: endpointType = prodEndpointsConfig;

import { environment as stageEnvironmentConfig, endpoints as stageEndpointsConfig } from './environment.stage';
export const stageEnvironment: environmentType = stageEnvironmentConfig;
export const stageEndpoints: endpointType = stageEndpointsConfig;

import { environment as localEnvironmentConfig, endpoints as localEndpointsConfig } from './environment.local';
export const localEnvironment: environmentType = localEnvironmentConfig;
export const localEndpoints: endpointType = localEndpointsConfig;

/* default to dev environment */
export const environment: environmentType = devEnvironment;
export const endpoints: endpointType = devEndpoints;

// export endpointType for use in other files
export { endpointType };
