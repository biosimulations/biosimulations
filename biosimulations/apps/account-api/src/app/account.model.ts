import { prop } from '@typegoose/typegoose';
import { IsString, IsBoolean, IsUrl } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

// TODO abstract this to the datamodel library
export class Profile {
  @ApiProperty({ type: String, nullable: true })
  @IsString()
  firstName!: string | null;

  @ApiProperty({ type: String, nullable: true, required: false, default: null })
  @IsString()
  middleName!: string | null;

  @ApiProperty({ type: String, nullable: true })
  @IsString()
  lastName!: string | null;

  @ApiProperty({ type: String, nullable: true })
  @IsUrl()
  image!: string | null;

  @ApiProperty({ type: String, nullable: false })
  @IsString()
  userName!: string;

  @ApiProperty({ type: String, nullable: true })
  @IsString()
  organization: string | null = null;

  @ApiProperty({ type: String, nullable: true })
  @IsUrl()
  website: string | null = null;

  @ApiProperty({ type: String, nullable: true })
  @IsString()
  description: string | null = null;

  @ApiProperty({ type: String, nullable: true })
  @IsString()
  summary: string | null = null;

  @ApiProperty({ type: Array })
  externalProfiles: any[] | null = [];

  @ApiProperty({ type: [String], nullable: true })
  emails: string[] | null = null;

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
export class Account {
  @ApiProperty({ type: String })
  @IsString()
  @prop({ type: String, required: true })
  _id: string;

  @ApiProperty({ type: String })
  @IsString()
  @prop({ type: String, required: true, unique: true })
  username: string;

  @ApiProperty({ type: () => Profile, nullable: true })
  @prop({ required: false, _id: false })
  profile?: Profile;

  // The date that the terms were accepted in seconds from epoch
  @ApiProperty({ type: Number })
  @IsString()
  @prop({ type: Number, required: true })
  termsAcceptedOn: number;

  @IsBoolean()
  @prop({ type: Boolean, required: true })
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
