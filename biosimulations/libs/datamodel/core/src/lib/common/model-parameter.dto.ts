import { DTO } from '@biosimulations/datamodel/utils';

export interface ModelParameterCore {
  id: string;
  name: string;
  value: number;
  units: string;
}

export type ModelParameterDTO = DTO<ModelParameterCore>;

export const isModelParameterDTO = (param: any): param is ModelParameterDTO =>
  'units' in param && 'id' in param && 'name' in param && 'value' in param;
