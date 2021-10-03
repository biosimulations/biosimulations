export interface File {
  id: string;
  simulationRun: string;
  location: string;
  format: string;
  name: string;
  url: string;
  // API returns only strings
  size: number | string;
}
