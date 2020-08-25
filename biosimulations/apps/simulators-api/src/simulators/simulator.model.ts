import {
  Format,
  Person,
  ExternalReferences,
  License,
  KISAOTerm,
  OntologyTerm,
  Algorithm,
  JournalReference,
  AlgorithmParameter,
} from '@biosimulations/shared/datamodel';

class Algorithms implements Algorithm {
  kisaoId!: string;
  parameters: AlgorithmParameter[] = [];
  id!: string;
  name!: string;
  ontologyTerms!: OntologyTerm[];
  modelingFrameworks!: OntologyTerm[];
  modelFormats!: Format[];
  simulationFormats!: Format[];
  archiveFormats!: Format[];
  references!: JournalReference[];
}
class Simulator {
  id!: string;
  name!: string;
  version!: string;
  description!: string;
  url!: string;
  dockerHubImageId!: string;
  format!: Format;
  authors!: Person[];
  references!: ExternalReferences;
  license!: License;
  algorithms!: [];
}
