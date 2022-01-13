import { environmentType } from './environment.type';
// Change the name of the file to environment.type.ts where type is the name of the environment you wish to load
import { environment as currentEnvironment } from './environment.dev';
export const environment: environmentType = currentEnvironment;
