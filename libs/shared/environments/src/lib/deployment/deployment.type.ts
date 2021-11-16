export type Deployment = {
  production: boolean;
  env: 'dev' | 'prod' | 'local' | 'prod' | 'stage';
};
