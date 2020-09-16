export interface SimulationDispatchSpec {
  nameOfSimulation: string;
  authorEmail: string;
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
