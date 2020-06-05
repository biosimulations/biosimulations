import { DTO } from '@biosimulations/datamodel/utils';
import { EdamId } from './alias';

export interface FormatCore {
  id: string;
  name: string;
  version: string;
  edamId: EdamId | null;
  specUrl: string | null;
  url: string | null;
  mimetype: string | null;
  extension: string | null;
  sedUrn: string | null;
}
export type FormatDTO = DTO<FormatCore>;
