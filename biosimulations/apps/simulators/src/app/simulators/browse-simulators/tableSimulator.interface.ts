import { SimulatorCurationStatus } from '@biosimulations/datamodel/common';

export interface TableSimulator {
  id: string;
  name: string;
  image: string | null;
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
  curationStatus: SimulatorCurationStatus;
  url: string;
  license: string | null;
  licenseId: string | null;
  created: Date;
}
