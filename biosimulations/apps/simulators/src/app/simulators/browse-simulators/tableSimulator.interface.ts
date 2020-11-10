export interface TableSimulator {
  id: string;
  name: string;
  frameworks: string[];
  frameworkIds: string[];
  algorithms: string[];
  algorithmIds: string[];
  formats: string[];
  formatIds: string[];
  latestVersion: string;
  validated: boolean;
  url: string;
  license: string;
  licenseId: string
  created: Date;
}
