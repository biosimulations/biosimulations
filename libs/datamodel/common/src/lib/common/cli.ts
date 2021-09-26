import { PackageRepository } from './package-repository';

export interface ICli {
  packageRepository: PackageRepository;
  package: string;
  command: string;
  installationInstructions: string | null;
}
