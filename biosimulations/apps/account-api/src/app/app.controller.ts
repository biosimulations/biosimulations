import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { AppService } from './app.service';
import { Account } from './account.model';
import {
  ApiProperty,
  ApiPropertyOptional,
  ApiSecurity,
  ApiOAuth2,
} from '@nestjs/swagger';
import { Profile } from '@biosimulations/datamodel/core';
import { AuthGuard } from '@nestjs/passport';
import {
  getUserId,
  permissions,
  JwtGuard,
  PermissionsGuard,
} from '@biosimulations/shared/biosimulations-auth';

class CreateAccountDTO {
  @ApiProperty()
  username!: string;
  @ApiProperty()
  token!: string;
  @ApiPropertyOptional()
  profile?: Profile;
}

@Controller()
export class AppController {
  constructor(private accountService: AppService) {}

  @UseGuards(JwtGuard, PermissionsGuard)
  @permissions('read:accounts')
  @ApiOAuth2([])
  @Get('list')
  async getAll() {
    return await this.accountService.findAll();
  }

  @Get('exists/:userId')
  async doesExist(@Param('userId') userId: string) {
    const account = await this.accountService.findById(userId);
    return account?._id === userId;
  }

  @Get('valid/:username')
  async checkUsername(@Param('username') username: string) {
    username = username.toLowerCase().trim();

    let valid = true;

    let message = `${username} is available`;

    // TODO make this common somewhere to also use in other resources
    const regEx = new RegExp('^[a-z_][a-z0-9_]{2,15}$');

    if (!regEx.test(username)) {
      valid = false;
      message =
        'Usernames must consist of numbers, letters and underscores \'_\'  only';
    } else {
      const taken = await this.accountService.find(username);

      if (taken) {
        valid = false;
        message = `${username} is already taken`;
      }
    }

    return { valid, message };
  }
  // @UseGuards(AuthGuard('secret'))
  @Post()
  createAccount(@Body() body: CreateAccountDTO) {
    const token = body.token;
    const userId = getUserId(token);
    const profile: Profile = body.profile || {
      userName: body.username,
      firstName: null,
      lastName: null,
      middleName: null,
      image: '',
      organization: null,
      website: null,
      description: null,
      externalProfiles: [],
      emails: null,
      summary: null,
    };

    const account: Account = new Account({
      username: body.username,
      _id: userId,
      termsAccepted: Date.now(),
      profile,
      admin: false,
    });

    return this.accountService.create(account);
  }
}
