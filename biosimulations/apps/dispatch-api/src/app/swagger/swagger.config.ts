import { SwaggerConfig } from './swagger.interface';

export const SWAGGER_CONFIG: SwaggerConfig = {
  title: 'runBioSimulations API Service',
  description: 'Allows dispatching of simulation jobs to UConn HPC',
  version: '0.0.1',
  tags: [
      'dispatch',
    ], // Include more tags if necessary 
};