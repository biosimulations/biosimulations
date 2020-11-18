export enum CurationStatus {
  'Registered with BioSimulators' = 1,
  'Algorithms curated' = 2,
  'Parameters curated' = 3,
  'Image available' = 4,
  'Image validated' = 5,
}

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
  curationStatus: CurationStatus;
  url: string;
  license: string | null;
  licenseId: string | null;
  created: Date;
}
