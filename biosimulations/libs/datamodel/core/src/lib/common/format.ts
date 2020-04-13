import { DTO } from '@biosimulations/datamodel/utils';
import { EdamId } from './alias';

export interface FormatCore {
  id: string;
  name: string;
  version: string;
  edamId: EdamId;
  specUrl?: string;
  url?: string;
  mimetype?: string;
  extension?: string;
  sedUrn?: string;
}
export type FormatDTO = DTO<FormatCore>;
