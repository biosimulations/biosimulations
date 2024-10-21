import { environmentType } from './environment.type';
/* Change the name of the file to environment.type.ts where type is the name of the environment you wish to load */
import { environment as currentEnvironment, endpoints as currentEndpoints } from './environment.dev';
export const environment: environmentType = currentEnvironment;
export const endpoints = currentEndpoints;
