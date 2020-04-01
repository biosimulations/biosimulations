import {
  JsonSerializable,
  JsonCompatible,
  Complete,
  DTO,
} from '@biosimulations/datamodel/utils';
import { AlgorithmDTO } from './algorithm.dto';

export interface AlgorithmParameterCore {
  id?: string;
  name?: string;
  value?: number;
  kisaoId?: number;
}
export function instanceOfAlgorithmParameterDTO(
  object: any,
): object is AlgorithmDTO {
  return 'kisaoId' in object;
}
export type AlgorithmParameterDTO = DTO<AlgorithmParameterCore>;
