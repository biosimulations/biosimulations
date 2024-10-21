export type envs = 'local' | 'dev' | 'stage' | 'prod' | 'dummy';
export type environmentType = {
  production: boolean;
  env: envs;
  baseUrl: string;
  version: string;
};
