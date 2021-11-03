import sboCorrectionsJson from './sbo-corrections.json';

export interface SboCorrection {
  id: string;
  parents: string[];
}

export const sboCorrections: SboCorrection[] = sboCorrectionsJson;
