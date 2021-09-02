import { environment } from '@biosimulations/shared/environments';

export type endpoints =
  | 'api'
  | 'simulationRuns'
  | 'simulationRunResults'
  | 'simulationRunLogs'
  | 'simulationRunMetadata'
  | 'simulators'
  | 'files';

type endpointMap = { [key in endpoints]: string };

const baseUrl = environment.baseUrl || 'https://api.biosimulations.dev';

export const Endpoints: endpointMap = {
  api: baseUrl,
  simulationRuns: `${baseUrl}/runs`,
  simulationRunResults: `${baseUrl}/results`,
  simulationRunLogs: `${baseUrl}/logs`,
  simulationRunMetadata: `${baseUrl}/metadata`,
  simulators: `${baseUrl}/simulators`,
  files: `${baseUrl}/files`
};
