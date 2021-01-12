import { ApiProperty } from "@nestjs/swagger";

export class refreshImageBody {
    @ApiProperty()
    simulator!: string
    @ApiProperty()
    version!: string

}