import { IsString } from 'class-validator';

export class CreateProjectDto {
    @IsString()
    readonly projectName!: string;

    @IsString()
    readonly uuid!: string;

    @IsString()
    readonly _email!: string;
}