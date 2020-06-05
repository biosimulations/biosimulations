import { prop } from '@typegoose/typegoose';
import { IsString, IsBoolean, IsJSON, IsUrl, IsEmail } from 'class-validator';
import { ProfileDTO, ExternalProfile } from '@biosimulations/datamodel/core';
import { DTO } from '@biosimulations/datamodel/utils';

// TODO abstract this to the datamodel library
// TODO Include open api definitions
export class Profile implements ProfileDTO {
  @IsString()
  userName!: string;
  @IsString()
  organization: string | null = null;
  @IsUrl()
  website: string | null = null;
  @IsEmail()
  gravatarEmail: string | null = null;
  @IsString()
  description: string | null = null;
  @IsString()
  summary: string | null = null;

  externalProfiles: ExternalProfile[] = [];
  @IsString()
  emails: string | null = null;

  constructor(profile: ProfileDTO) {
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
  profile: ProfileDTO | null;
}
export class Account {
  @IsString()
  @prop({ required: true })
  _id: string;

  @IsString()
  @prop({ required: true, unique: true })
  username: string;

  @prop({ required: false })
  profile?: Profile;

  // The date that the terms were accepted in seconds from epoch
  @IsString()
  @prop({ required: true })
  termsAccepted: number;

  @IsBoolean()
  @prop({ required: true })
  admin: boolean;

  constructor(account: AccountDTO) {
    this._id = account._id;
    this.admin = account.admin;
    this.termsAccepted = account.termsAccepted;
    this.username = account.username;
    if (account.profile) {
      this.profile = new Profile(account.profile);
    }
  }
}
