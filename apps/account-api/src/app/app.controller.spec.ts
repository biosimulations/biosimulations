import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import { TypegooseModule } from 'nestjs-typegoose';
import { ConfigService } from '@nestjs/config';
import { Account } from './account.model';
import { BiosimulationsAuthModule } from '@biosimulations/auth/nest';
import { AppService } from './app.service';
import { AccountManagementModule, ManagementService } from '@biosimulations/account/management';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [
        BiosimulationsConfigModule,
        TypegooseModule.forRootAsync({
          imports: [BiosimulationsConfigModule],
          useFactory: async (configService: ConfigService) => ({
            uri: configService.get('database.uri') as string,
            useNewUrlParser: true,
            useUnifiedTopology: true,
          }),
          inject: [ConfigService],
        }),
        TypegooseModule.forFeature([Account]),
        BiosimulationsAuthModule,
        
      ],
      providers: [AppService, {provide: ManagementService, useValue: {}}],
      controllers: [AppController],
    }).compile();
  });

  describe('createUser', () => {
    it('should return username of created user', () => {});
  });
});
