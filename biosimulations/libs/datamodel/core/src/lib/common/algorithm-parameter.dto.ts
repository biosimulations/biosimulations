import { DTO, isOfType } from '@biosimulations/datamodel/utils';
import { AlgorithmDTO } from './algorithm.dto';

class AlgorithmParameterCore {
  id?: string;
  name?: string;
  value?: number;
  kisaoId?: number;
}

export type AlgorithmParameterDTO = DTO<AlgorithmParameterCore>;

/*
 * // TODO can this be made generic?
 * Perhaps can create a method that takes in a param  as well as new instantiated "core" class
 * would then use reflect to check all parameters?
 */

export const isAlgorithmParameterDTO = (param: any): param is AlgorithmDTO =>
  'kisaoId' in param && 'id' in param && 'name' in param && 'value' in param;
