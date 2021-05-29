import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MetaObject } from './meta';

export class AboutLinksObject {
  @ApiPropertyOptional({ type: String })
  about!: string;
}
export class ErrorSourceObject {
  @ApiPropertyOptional({ type: String })
  pointer?: string;

  @ApiPropertyOptional({ type: String })
  parameter?: string;
}

export class ErrorObject {
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
  meta?: MetaObject;
}

export class ErrorResponseDocument {
  @ApiProperty({ type: [ErrorObject] })
  error!: ErrorObject[];

  @ApiProperty({ type: Object })
  meta?: MetaObject;
}
