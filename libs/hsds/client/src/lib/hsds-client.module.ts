import {
  DynamicModule,
  Inject,
  Injectable,
  Module,
  Options,
  Provider,
} from '@nestjs/common';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';

import { ApiModule, Configuration } from '@biosimulations/hdf5apiclient';
import { ConfigService } from '@nestjs/config';

export interface HSDSConnectionOptions {
  username: string;
  password: string;
  basePath: string;
  withCredentials?: boolean;
}
export interface HSDSConnectionAsyncOptions {
  imports: any[];
  inject: any[];
  useFactory: HSDSConnectionOptionsFactory;
}

export interface HSDSConnectionOptionsFactory {
  createHSDSConnectionOptions(...args: any[]): HSDSConnectionOptions;
}

Module({
  imports: [BiosimulationsConfigModule],
});
export class HSDSClientModule {
  public static async registerAsync(
    options: HSDSConnectionAsyncOptions,
  ): Promise<DynamicModule> {
    const imports = options.imports || [];
    const dynamicImports = await this.getImports(options);
    const finalImports = imports.concat(dynamicImports);

    const providers = await this.getProviders(options);
    return {
      module: HSDSClientModule,
      providers: providers,
      imports: finalImports,
    };
  }

  private static async getProviders(
    options: HSDSConnectionAsyncOptions,
  ): Promise<Provider<HSDSConnectionOptions>[]> {
    return [
      {
        provide: 'HSDSOPTIONS',
        useFactory: options.useFactory.createHSDSConnectionOptions,
        inject: options.inject || [],
      },
    ];
  }
  private static async getImports(
    options: HSDSConnectionAsyncOptions,
  ): Promise<DynamicModule[]> {
    return [
      ...options.imports,
      {
        module: ApiModule,
        providers: [
          {
            provide: Configuration,
            useFactory: options.useFactory.createHSDSConnectionOptions,
            inject: [ConfigService],
          },
        ],
      },
    ];
  }
}
