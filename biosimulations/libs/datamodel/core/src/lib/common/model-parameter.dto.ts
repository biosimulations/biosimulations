import { DTO } from '@biosimulations/datamodel/utils';

export interface ModelParameterCore {
  id: string;
  name: string;
  value: number;
  units: string;
}

export type ModelParameterDTO = DTO<ModelParameterCore>;
