import { DTO } from '@biosimulations/datamodel/utils';

export class ModelVariableCore {
  id: string;
  name: string;
}
export type ModelVariableDTO = DTO<ModelVariableCore>;
