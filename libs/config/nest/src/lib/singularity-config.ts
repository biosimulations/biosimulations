import { registerAs } from '@nestjs/config';
import { EnvironmentVariable } from '@biosimulations/datamodel/common';

export default registerAs('singularity', () => {
  const singularityRunEnvVars: EnvironmentVariable[] = Object.entries(
    process.env as { [key: string]: string },
  )
    .filter((keyVal: [string, string]): boolean => {
      return keyVal[0].startsWith('SINGULARITY_RUN_ENV_VAR_');
    })
    .map((keyVal: [string, string]): EnvironmentVariable => {
      return {
        key: keyVal[0].substr('SINGULARITY_RUN_ENV_VAR_'.length),
        value: keyVal[1],
      };
    });

  return { envVars: singularityRunEnvVars };
});
