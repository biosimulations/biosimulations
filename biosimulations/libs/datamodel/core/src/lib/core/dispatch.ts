// Todo Determine best location for these
export interface SimulationDispatchSpec {
  simulator: string;
  filename: string;
  uniqueFilename: string;
  filepathOnDataStore: string;
}
export interface OmexDispatchFile {
  originalname: string;
  buffer: Buffer;
}
