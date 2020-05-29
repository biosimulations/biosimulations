import { Injectable } from '@nestjs/common';
import { Account, } from './account.model'
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';

@Injectable()
export class AppService {
    constructor(
        @InjectModel(Account) private readonly accountModel: ReturnModelType<typeof Account>
    ) { }

    async findById(userId: string): Promise<Account> {
        return await this.accountModel.findOne({ _id: userId }).exec()
    }
    async find(username: string): Promise<Account> {

        // tslint:disable-next-line
        return await this.accountModel.findOne({ username: username }).exec()
    }


    async create(createAccountDto: Account): Promise<Account> {
        const createdAccount = new this.accountModel(createAccountDto);
        return await createdAccount.save();
    }

    async findAll(): Promise<Account[] | null> {
        return await this.accountModel.find().exec();
    }
}
