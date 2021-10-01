import { registerAs } from '@nestjs/config';

interface PurposedEnvironmentVariable {
  key: string;
  value: string;
  purpose: string;
}

export default registerAs('singularity', () => {
  const singularityRunEnvVars: PurposedEnvironmentVariable[] = Object.entries(
    process.env as { [key: string]: string },
  )
    .filter((keyVal: [string, string]): boolean => {
      return keyVal[0].startsWith('SINGULARITY_RUN_ENV_VAR_');
    })
    .map((keyVal: [string, string]): PurposedEnvironmentVariable => {
      const key = keyVal[0].substr('SINGULARITY_RUN_ENV_VAR_'.length);
      const keyParts = key.split('_');

      return {
        key: keyParts.slice(1).join('_'),
        value: keyVal[1],
        purpose: keyParts.split('_')[0],
      };
    });

  return { envVars: singularityRunEnvVars };
});
