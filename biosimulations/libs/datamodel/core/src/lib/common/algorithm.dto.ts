import { AlgorithmParameterDTO } from './algorithm-parameter.dto';
import { DTO } from '@biosimulations/datamodel/utils';
import { KisaoId } from '../aliases/identity';
import { OntologyTermDTO, FormatDTO, JournalReferenceDTO } from '.';

export interface AlgorithmCore {
  id: string;
  name: string;
  kisaoId: KisaoId;
  ontologyTerms: OntologyTermDTO[];
  modelingFrameworks: OntologyTermDTO[];
  modelFormats: FormatDTO[];
  parameters: AlgorithmParameterDTO[];
  simulationFormats: FormatDTO[];
  archiveFormats: FormatDTO[];
  references: JournalReferenceDTO[];
}
export type AlgorithmDTO = DTO<AlgorithmCore>;
