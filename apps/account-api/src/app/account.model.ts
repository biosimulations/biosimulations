import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString, IsBoolean, IsUrl, IsOptional } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

// TODO abstract this to the datamodel library
export class Profile {
  @ApiProperty({ type: String, nullable: true, required: false, default: null })
  @IsOptional()
  @IsString()
  firstName: string | null;

  @ApiProperty({ type: String, nullable: true, required: false, default: null })
  @IsOptional()
  @IsString()
  middleName: string | null;

  @ApiProperty({ type: String, nullable: true, required: false, default: null })
  @IsOptional()
  @IsString()
  lastName: string | null;

  @ApiProperty({ type: String, nullable: true, required: false, default: null })
  @IsOptional()
  @IsUrl({
    require_protocol: true,
    protocols: ['http', 'https'],
  })
  image: string | null;

  @ApiProperty({ type: String, nullable: false })
  @IsString()
  userName!: string;

  @ApiProperty({ type: String, nullable: true, required: false, default: null })
  @IsOptional()
  @IsString()
  organization: string | null;

  @ApiProperty({ type: String, nullable: true, required: false, default: null })
  @IsOptional()
  @IsUrl({
    require_protocol: true,
    protocols: ['http', 'https'],
  })
  website: string | null;

  @ApiProperty({ type: String, nullable: true, required: false, default: null })
  @IsOptional()
  @IsString()
  description: string | null;

  @ApiProperty({ type: String, nullable: true, required: false, default: null })
  @IsOptional()
  @IsString()
  summary: string | null;

  @ApiProperty({ type: Array, nullable: true, required: false, default: [] })
  @IsOptional()
  externalProfiles: string[] = [];

  @ApiProperty({ type: [String], nullable: true, required: false, default: [] })
  @IsOptional()
  emails: string[] = [];

  constructor(profile: any) {
    Object.assign(this, profile);
    if (!this.externalProfiles) {
      this.externalProfiles = [];
    }
  }
}
export interface AccountDTO {
  _id: string;
  username: string;
  admin: boolean;
  termsAccepted: number;
  profile: Profile | null;
}
@Schema({ collection: 'Accounts' })
export class Account {
  @ApiProperty({ type: String })
  @IsString()
  @Prop({ type: String, required: true })
  _id: string;

  @ApiProperty({ type: String })
  @IsString()
  @Prop({ type: String, required: true, unique: true })
  username: string;

  @ApiProperty({ type: () => Profile, nullable: true })
  @Prop({ required: false, _id: false })
  profile?: Profile;

  // The date that the terms were accepted in seconds from epoch
  @ApiProperty({ type: Number })
  @IsString()
  @Prop({ type: Number, required: true })
  termsAcceptedOn: number;

  @IsBoolean()
  @Prop({ type: Boolean, required: true })
  admin: boolean;

  constructor(account: AccountDTO) {
    this._id = account._id;
    this.admin = account.admin;
    this.termsAcceptedOn = account.termsAccepted;
    this.username = account.username;
    if (account.profile) {
      this.profile = new Profile(account.profile);
    }
  }
}
export const accountSchema = SchemaFactory.createForClass(Account);
