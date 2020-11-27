import { IEdamOntologyIdVersion } from './ontology';
import { OperatingSystemType } from './operating-system-type';

export interface IImage {
  url: string;
  format: IEdamOntologyIdVersion;
  operatingSystemType: OperatingSystemType | null;
}
