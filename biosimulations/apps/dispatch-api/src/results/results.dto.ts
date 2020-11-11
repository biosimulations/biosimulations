import { ApiProperty } from '@nestjs/swagger';

export class Results {
  @ApiProperty({ type: String })
  id!: string;
}
