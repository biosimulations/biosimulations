export interface DependentPackage {
  name: string;
  version: string | null;
  required: boolean;
  freeNonCommercialLicense: boolean;
  url: string | null;
}
