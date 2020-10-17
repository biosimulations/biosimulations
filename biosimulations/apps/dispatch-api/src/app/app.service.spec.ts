import { FileModifiers } from './../../../../libs/dispatch/file-modifiers/src/lib/dispatch-file-modifiers';
import { HttpModule, HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, NatsOptions, Transport } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';


import { AppService } from './app.service';
import { ModelsService } from './resources/models/models.service';
import { DispatchSimulationStatus } from '@biosimulations/dispatch/api-models';

describe('AppService', () => {
    let app: TestingModule;
    const mockService = {};
    const mockFileStoragePath = new ConfigService({
        hpc: {
            fileStorage: './apps/dispatch-api/src/assets/fixtures/'
        }
    }) as ConfigService;
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
                {
                    provide: ConfigService,
                    useValue: mockFileStoragePath,
                }
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

    describe('test getVisualizationData', () => {
        it('Should return data of non-chart report JSON', async () => {
            const appService = app.get<AppService>(AppService);
            const jsonFilePath = './apps/dispatch-api/src/assets/fixtures/simulations/f1a516db-fa6b-4afb-93bd-e951b539f54f/out/det_7_RKF/task1.json'
            expect(await appService.getVisualizationData('f1a516db-fa6b-4afb-93bd-e951b539f54f', 'det_7_RKF', 'task1', false)).toEqual(
                {
                    "data": JSON.parse(await FileModifiers.readFile(jsonFilePath)),
                    "message": "Data fetched successfully"
                });
        });
    });

    describe('test getResultStructure', () => {
        it('Should return SED-ML and their respective reports in an Object', async () => {
            const appService = app.get<AppService>(AppService);
            expect(await appService.getResultStructure('f1a516db-fa6b-4afb-93bd-e951b539f54f')).toEqual({
                "message": "OK",
                "data": { }
            });
        });
    });

    afterEach(() => {
        jest.resetAllMocks();
    });
});
