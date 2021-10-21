import { MetaObject } from './meta';

export class AboutLinksObject {
  about!: string;
}

export class ErrorSourceObject {
  pointer?: string;
  parameter?: string;
}

export interface ErrorObject {
  id?: string;
  links?: AboutLinksObject;
  status?: string;
  code?: string;
  title?: string;
  detail?: string;
  source?: ErrorSourceObject;
  meta?: MetaObject;
}

export interface ErrorResponseDocument {
  error: ErrorObject[];
  meta?: MetaObject;
}
