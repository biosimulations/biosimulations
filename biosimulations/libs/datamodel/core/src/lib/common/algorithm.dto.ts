import { AlgorithmParameterDTO } from './algorithm-parameter.dto';
import { DTO } from '@biosimulations/datamodel/utils';

export interface AlgorithmCore {
  id: string;
  name?: string;
  parameters?: AlgorithmParameterDTO[];
}
export type AlgorithmDTO = DTO<AlgorithmCore>;
