import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MetaObject } from './meta';

export class AboutLinksObject {
  @ApiPropertyOptional()
  about!: string;
}
export class ErrorSourceObject {
  @ApiPropertyOptional()
  pointer?: string;
  @ApiPropertyOptional()
  parameter?: string;
}

export class ErrorObject {
  @ApiPropertyOptional()
  id?: string;
  @ApiPropertyOptional()
  links?: AboutLinksObject;
  @ApiPropertyOptional()
  status?: string;
  @ApiPropertyOptional()
  code?: string;
  @ApiPropertyOptional()
  title?: string;
  @ApiPropertyOptional()
  detail?: string;
  @ApiPropertyOptional()
  source?: ErrorSourceObject;
  @ApiPropertyOptional()
  meta?: MetaObject;
}
export class ErrorResponseDocument {
  @ApiProperty({ type: [ErrorObject] })
  error!: ErrorObject[];
  @ApiProperty()
  meta?: MetaObject;
}
