import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { nestConfig } from './biosimulations-secrets';
@Module({
    imports: [ConfigModule.forRoot({
        isGlobal: true,
        load: [nestConfig],
        envFilePath: './config.env',
    }),],
    providers: [ConfigService],
    exports: [ConfigService, ConfigModule],
})
export class BiosimulationsConfigModule { }
