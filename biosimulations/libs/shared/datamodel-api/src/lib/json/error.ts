import { MetaObject } from './meta';

export class AboutLinksObject {
  about!: string;
}
export class ErrorSourceObject {
  pointer?: string;
  parameter?: string;
}

export class ErrorObject {
  id?: string;
  links?: AboutLinksObject;
  status?: string;
  code?: string;
  title?: string;
  detail?: string;
  source?: ErrorSourceObject;
  meta?: MetaObject;
}
