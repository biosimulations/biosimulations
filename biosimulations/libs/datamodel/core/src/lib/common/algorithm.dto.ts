import { AlgorithmParameterDTO } from './algorithm-parameter.dto';
import { DTO } from '@biosimulations/datamodel/utils';
import { KisaoId } from '../aliases/identity';
import { OntologyTermDTO } from './ontology-term.dto';
import { FormatDTO } from './format.dto';

export interface AlgorithmCore {
  id: string;
  name?: string;
  kisaoId: KisaoId;
  ontologyTerms: OntologyTermDTO[];
  modelingFrameworks: OntologyTermDTO[];
  modelFormats: FormatDTO[];
  parameters?: AlgorithmParameterDTO[];
}
export type AlgorithmDTO = DTO<AlgorithmCore>;
