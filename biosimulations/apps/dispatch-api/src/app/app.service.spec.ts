import { HttpModule, HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, NatsOptions, Transport } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

import { AppService } from './app.service';
import { ModelsService } from './resources/models/models.service';

describe('AppService', () => {
    let app: TestingModule;
    // let service: AppService;
    const mockService = {};

    beforeAll(async () => {
        app = await Test.createTestingModule({
            imports: [HttpModule],
            controllers: [AppController],
            providers: [
                AppService,
                {
                    provide: 'DISPATCH_MQ',
                    useFactory: (configService: ConfigService) => {
                        const natsServerConfig = configService.get('nats');
                        const natsOptions: NatsOptions = {};
                        natsOptions.transport = Transport.NATS;
                        natsOptions.options = natsServerConfig;
                        return ClientProxyFactory.create(natsOptions);
                    },
                    inject: [ConfigService],
                },
                {
                    provide: ModelsService,
                    useValue: mockService,
                },
                ConfigService,
            ],
        }).compile();

        // service = app.get<AppService>(AppService);
    });

    describe('test getSimulators', () => {
        it('should return the versions of copasi bioSimulator', async () => {
            const appService = app.get<AppService>(AppService);
            expect(await appService.getSimulators('copasi')).toEqual([
                "latest",
                "4.27.214",
                "4.28.226",
            ]);
        });
    });

    describe('test uploadFile', () => {
        it('should return "No Simulator was provided" when no simulator is provided', async () => {
            const appService = app.get<AppService>(AppService);
            expect(await appService.uploadFile(
                {
                    // tslint:disable-next-line: deprecation
                    buffer: Buffer.alloc(1, ''),
                    originalname: '',
                },
                {
                    filepathOnDataStore: '',
                    simulator: '',
                    simulatorVersion: '',
                    filename: '',
                    uniqueFilename: '',
                    authorEmail: '',
                    nameOfSimulation: '',
                }
            )).toEqual({
                message: 'No Simulator was provided',
            });
        });
    });



});
