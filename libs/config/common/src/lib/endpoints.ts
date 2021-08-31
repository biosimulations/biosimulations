import { environment } from '@biosimulations/shared/environments';

export type endpoints =
  | 'simulationRuns'
  | 'simulationRunResults'
  | 'simulationRunLogs'
  | 'simulationRunMetadata'  
  | 'simulators';

type endpointMap = { [key in endpoints]: string };

const baseUrl = environment.baseUrl || 'https://api.biosimulations.dev';


export const Endpoints: endpointMap = {
  simulationRuns: `${baseUrl}/runs`,
  simulationRunResults: `${baseUrl}/results`,
  simulationRunLogs: `${baseUrl}/logs`,
  simulationRunMetadata: `${baseUrl}/metadata`,  
  simulators: `${baseUrl}/simulators`,
  
};
