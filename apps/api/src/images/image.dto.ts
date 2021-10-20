import { ApiProperty } from '@nestjs/swagger';

export class refreshImageBody {
  @ApiProperty()
  public simulator!: string;
  @ApiProperty()
  public version!: string;
}
