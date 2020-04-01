import { DTO } from '@biosimulations/datamodel/utils';
import { AlgorithmDTO } from './algorithm.dto';

export interface AlgorithmParameterCore {
  id?: string;
  name?: string;
  value?: number;
  kisaoId?: number;
}
export const isAlgorithmParameterDTO = (param: any): param is AlgorithmDTO =>
  'kisaoId' in param;

export type AlgorithmParameterDTO = DTO<AlgorithmParameterCore>;
