export enum specificationVersions {
  latest = '1.0.0',
  '1.0.0' = '1.0.0',
}
export enum imageVersions {
  latest = '1.0.0',
  '1.0.0' = '1.0.0',
}
export interface IBiosimulatorsMeta {
  specificationVersion: specificationVersions;
  imageVersion: imageVersions;
  validated: boolean;
}
