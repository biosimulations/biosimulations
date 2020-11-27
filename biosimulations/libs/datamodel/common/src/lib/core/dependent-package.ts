export interface DependentPackage {
  name: string;
  version: string | null;
  required: boolean;
  freeNonCommericalLicense: boolean;
  url: string | null;
}
