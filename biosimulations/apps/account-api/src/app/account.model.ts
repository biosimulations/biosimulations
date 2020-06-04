import { prop } from '@typegoose/typegoose';
import { IsString, IsBoolean, IsJSON, IsUrl, IsEmail } from 'class-validator';
import { ProfileDTO, ExternalProfile } from '@biosimulations/datamodel/core';
import { DTO } from '@biosimulations/datamodel/utils';

// TODO abstract this to the datamodel library
// TODO Include open api definitions
export class Profile implements ProfileDTO {
  @IsString()
  userName: string;
  @IsString()
  organization: string;
  @IsUrl()
  website: string;
  @IsEmail()
  gravatarEmail: string;
  @IsString()
  description: string;
  @IsString()
  summary: string;

  externalProfiles: ExternalProfile[];
  @IsString()
  emails: string;
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
}
