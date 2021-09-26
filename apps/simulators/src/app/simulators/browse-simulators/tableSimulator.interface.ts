import { SimulatorCurationStatus } from '@biosimulations/datamodel/common';

export interface TableSimulator {
  id: string;
  name: string;
  description: string;
  image?: string;
  cli?: string;
  pythonApi?: string;
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
  interfaceTypes: string[];
  supportedOperatingSystemTypes: string[];
  supportedProgrammingLanguages: string[];
  curationStatus: SimulatorCurationStatus;
  url: string | null;
  license: string | null;
  licenseId: string | null;
  updated: Date;
}
