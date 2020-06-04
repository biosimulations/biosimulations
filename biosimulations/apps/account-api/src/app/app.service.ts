import { Injectable } from '@nestjs/common';
import { Account } from './account.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { AuthzService } from '@biosimulations/shared/biosimulations-auth';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Account)
    private readonly accountModel: ReturnModelType<typeof Account>,
    private authz: AuthzService,
  ) {}

  async findById(userId: string): Promise<Account> {
    return await this.accountModel.findOne({ _id: userId }).exec();
  }
  async find(username: string): Promise<Account> {
    // tslint:disable-next-line
    return await this.accountModel.findOne({ username: username }).exec();
  }

  async create(createAccountDto: Account): Promise<Account> {
    const createdAccount = await new this.accountModel(createAccountDto).save();
    this.authz.updateUserMetadata(createdAccount._id, {
      username: createdAccount.username,
    });
    this.authz.updateAppMetadata(createdAccount._id, { registered: true });
    return createdAccount;
  }

  async findAll(): Promise<Account[] | null> {
    return await this.accountModel.find().exec();
  }
}
