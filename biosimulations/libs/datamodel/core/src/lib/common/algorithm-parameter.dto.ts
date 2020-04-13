import { DTO } from '@biosimulations/datamodel/utils';
import { KisaoId } from '../aliases/identity';
import { PrimitiveType } from '../enums/primitive-type';

export interface AlgorithmParameterCore {
  id: string;
  name: string;
  type: PrimitiveType;
  value: boolean | number | string;
  // Todo make this a conditional type based on value
  recomendedRange?: (boolean | number | string)[];
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
