import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import { BiosimulationsAuthModule } from '@biosimulations/auth/nest';
import { AppService } from './app.service';
import { Account, accountSchema } from './account.model';
import { AccountManagementModule } from '@biosimulations/account/management';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    BiosimulationsConfigModule,
    BiosimulationsAuthModule,
    AccountManagementModule,
    MongooseModule.forRootAsync({
      imports: [BiosimulationsConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('database.uri') || '',
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),

      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      {
        name: Account.name,
        schema: accountSchema,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
