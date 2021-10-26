import { ApiProperty } from '@nestjs/swagger';

export class refreshImageBody {
  @ApiProperty({ type: String })
  public simulator!: string;

  @ApiProperty({ type: String })
  public version!: string;
}
