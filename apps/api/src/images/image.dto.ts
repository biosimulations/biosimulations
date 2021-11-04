import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class refreshImageBody {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public simulator!: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public version!: string;
}
