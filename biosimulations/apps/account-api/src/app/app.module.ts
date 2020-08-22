import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import { BiosimulationsAuthModule } from '@biosimulations/auth/nest';
import { AppService } from './app.service';
import { Account } from './account.model';
@Module({
  imports: [
    BiosimulationsConfigModule,
    BiosimulationsAuthModule,
    TypegooseModule.forRootAsync({
      imports: [BiosimulationsConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('database.uri') || '',
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),

      inject: [ConfigService],
    }),
    TypegooseModule.forFeature([Account]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
