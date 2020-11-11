export interface TableSimulator {
  id: string;
  name: string;
  image?: string;
  frameworks: string[];
  frameworkIds: string[];
  algorithms: string[];
  algorithmIds: string[];
  modelFormats: string[];
  modelFormatIds: string[];
  simulationFormats: string[];
  simulationFormatIds: string[];
  archiveFormats: string[];
  archiveFormatIds: string[];
  latestVersion: string;
  validated: boolean;
  url: string;
  license: string;
  licenseId: string
  created: Date;
}
