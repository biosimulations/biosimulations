import { EdamId } from '../aliases/identity';
import { DTO } from '@biosimulations/datamodel/utils';

export interface ModelFormatCore {
  name: string;
  version: string;
  edamId: EdamId;
  url: string;
}
export type ModelFormatDTO = DTO<ModelFormatCore>;
