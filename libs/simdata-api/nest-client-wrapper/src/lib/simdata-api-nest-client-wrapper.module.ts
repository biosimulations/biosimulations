import { Module, Global, DynamicModule, Provider, Abstract, Type } from '@nestjs/common';
import { Configuration as SimdataAPIConfiguration, ApiModule } from '@biosimulations/simdata-api-nest-client';

export { SimdataAPIConfiguration };
export interface SimdataAPIConnectionOptions {
  username: string;
  password: string;
  basePath: string;
  withCredentials?: boolean;
}
export type SimdataAPIConnectionOptionsFactory = (...args: any[]) => SimdataAPIConfiguration;

export interface SimdataAPIConnectionAsyncOptions {
  imports: any[];
  // eslint-disable-next-line @typescript-eslint/ban-types
  inject: (string | symbol | Function | Type<any> | Abstract<any>)[];
  useFactory: SimdataAPIConnectionOptionsFactory;
}

import { ConfigService } from '@nestjs/config';
@Global()
@Module({
  controllers: [],
  providers: [],
  exports: [ApiModule],
})
export class SimdataApiNestClientWrapperModule {
  public static async forRootAsync(options: SimdataAPIConnectionAsyncOptions): Promise<DynamicModule> {
    const imports = options.imports || [];
    const dynamicImports = await this.getImports(options);
    const finalImports = imports.concat(dynamicImports);

    const providers = await this.getProviders(options);
    return {
      module: SimdataApiNestClientWrapperModule,
      providers: providers,
      imports: finalImports,
    };
  }
  private static async getImports(options: SimdataAPIConnectionAsyncOptions): Promise<DynamicModule[]> {
    return [
      ...options.imports,
      {
        module: ApiModule,
        providers: [
          {
            provide: SimdataAPIConfiguration,
            useFactory: options.useFactory,
            inject: [ConfigService],
          },
        ],
      },
    ];
  }
  private static async getProviders(
    options: SimdataAPIConnectionAsyncOptions,
  ): Promise<Provider<SimdataAPIConfiguration>[]> {
    {
      return [
        {
          provide: SimdataAPIConfiguration,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
      ];
    }
  }
}
