export interface SimulationDispatchSpec {
  name: string;
  email: string;
  simulator: string;
  simulatorVersion: string;
  filename: string;
  uniqueFilename: string;
  filepathOnDataStore: string;
}
export interface OmexDispatchFile {
  originalname: string;
  buffer: any;
}
