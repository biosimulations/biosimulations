import { EdamId } from '../aliases/identity';
import { DTO } from '@biosimulations/datamodel/utils';

export interface FormatCore {
  id: string;
  name: string;
  specUrl?: string;
  version: string;
  edamId: EdamId;
  url?: string;
}
export type FormatDTO = DTO<FormatCore>;
