import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Account } from './account.model';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProfileDTO } from '@biosimulations/datamodel/core';
import { AuthGuard } from '@nestjs/passport';
import { getUserId } from '@biosimulations/shared/biosimulations-auth';

class CreateAccountDTO {
  @ApiProperty()
  username: string;
  @ApiProperty()
  token: string;
  @ApiPropertyOptional()
  profile?: ProfileDTO;
}

@Controller()
export class AppController {
  constructor(private accountService: AppService) {}
  @Get('list')
  async getAll() {
    return (await this.accountService.findAll()).map(
      (account) => account.username,
    );
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
        "Usernames must consist of numbers, letters and underscores '_'  only";
    } else {
      const taken = await this.accountService.find(username);

      if (taken) {
        valid = false;
        message = `${username} is already taken`;
      }
    }

    return { valid, message };
  }
  //@UseGuards(AuthGuard('secret'))
  @Post()
  createAccount(@Body() body: CreateAccountDTO) {
    const token = body.token;
    const userId = getUserId(token);

    const account: Account = {
      username: body.username,
      _id: userId,
      termsAccepted: Date.now(),
      profile: body.profile,
      admin: false,
    };

    return this.accountService.create(account);
  }
}
