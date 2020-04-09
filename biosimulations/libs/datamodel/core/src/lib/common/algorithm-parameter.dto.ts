import { DTO } from '@biosimulations/datamodel/utils';
import { KisaoId } from '../aliases/identity';

export interface AlgorithmParameterCore {
  id: string;
  name: string;
  value: number;
  kisaoId: KisaoId;
}

export type AlgorithmParameterDTO = DTO<AlgorithmParameterCore>;

/*
 * // TODO can this be made generic?
 * Perhaps can create a method that takes in a param  as well as new instantiated "core" class
 * would then use reflect to check all parameters?
 */

export const isAlgorithmParameterDTO = (
  param: any,
): param is AlgorithmParameterDTO =>
  'kisaoId' in param && 'id' in param && 'name' in param && 'value' in param;
