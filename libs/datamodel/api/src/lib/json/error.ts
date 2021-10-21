import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  AboutLinksObject as IAboutLinksObject,
  ErrorSourceObject as IErrorSourceObject,
  ErrorObject as IErrorObject,
  ErrorResponseDocument as IErrorResponseDocument,
  MetaObject as IMetaObject,
} from '@biosimulations/datamodel/common';

export class AboutLinksObject implements IAboutLinksObject {
  @ApiPropertyOptional({ type: String })
  about!: string;
}

export class ErrorSourceObject implements IErrorSourceObject {
  @ApiPropertyOptional({ type: String })
  pointer?: string;

  @ApiPropertyOptional({ type: String })
  parameter?: string;
}

export class ErrorObject implements IErrorObject {
  @ApiPropertyOptional({ type: String })
  id?: string;

  @ApiPropertyOptional({ type: AboutLinksObject })
  links?: AboutLinksObject;

  @ApiPropertyOptional({ type: String })
  status?: string;

  @ApiPropertyOptional({ type: String })
  code?: string;

  @ApiPropertyOptional({ type: String })
  title?: string;

  @ApiPropertyOptional({ type: String })
  detail?: string;

  @ApiPropertyOptional({ type: ErrorSourceObject })
  source?: ErrorSourceObject;

  @ApiPropertyOptional({ type: Object })
  meta?: IMetaObject;
}

export class ErrorResponseDocument implements IErrorResponseDocument {
  @ApiProperty({ type: [ErrorObject] })
  error!: ErrorObject[];

  @ApiProperty({ type: Object })
  meta?: IMetaObject;
}
