import { EdamId } from './alias';

export interface Format {
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
