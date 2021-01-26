import { Injectable } from '@nestjs/common';
import { Account } from './account.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { ManagementService } from '@biosimulations/account/management';
import { UserMetadata, AppMetadata } from '@biosimulations/auth/common';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Account)
    private readonly accountModel: ReturnModelType<typeof Account>,
    private authz: ManagementService,
  ) {}

  async findById(userId: string): Promise<Account | null> {
    return await this.accountModel.findOne({ _id: userId }).exec();
  }
  async find(username: string): Promise<Account | null> {
    // tslint:disable-next-line
    return await this.accountModel.findOne({ username: username }).exec();
  }

  async deleteAll() {
    return await this.accountModel.deleteMany({});
  }

  async create(createAccountDto: Account): Promise<Account> {
    const createdAccount = await (
      await new this.accountModel(createAccountDto).save()
    ).toObject();
    const userMetadata: UserMetadata = {
      username: createdAccount.username,
    };

    // TODO Determine admin status dynamically
    const appMetadata: AppMetadata = {
      registered: true,
      termsAcceptedOn: createdAccount.termsAcceptedOn,
      roles: [],
      permissions: [],
    };
    this.authz.updateUserMetadata(createdAccount._id, userMetadata);
    this.authz.updateAppMetadata(createdAccount._id, appMetadata);
    return createdAccount;
  }

  async findAll(): Promise<Account[] | null> {
    return await this.accountModel.find().exec();
  }
}
