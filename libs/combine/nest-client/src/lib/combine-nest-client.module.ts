import {
  Module,
  Global,
  DynamicModule,
  Provider,
  Abstract,
  Type,
} from '@nestjs/common';
import {
  Configuration as CombineAPIConfiguration,
  ApiModule,
} from '@biosimulations/combine-api-client';

export { CombineAPIConfiguration };
export interface CombineAPIConnectionOptions {
  username: string;
  password: string;
  basePath: string;
  withCredentials?: boolean;
}
export type CombineAPIConnectionOptionsFactory = (
  ...args: any[]
) => CombineAPIConfiguration;

export interface CombineAPIConnectionAsyncOptions {
  imports: any[];
  // eslint-disable-next-line @typescript-eslint/ban-types
  inject: (string | symbol | Function | Type<any> | Abstract<any>)[];
  useFactory: CombineAPIConnectionOptionsFactory;
}

import { ConfigService } from '@nestjs/config';
@Global()
@Module({
  controllers: [],
  providers: [],
  exports: [ApiModule],
})
export class CombineNestClientModule {
  public static async forRootAsync(
    options: CombineAPIConnectionAsyncOptions,
  ): Promise<DynamicModule> {
    const imports = options.imports || [];
    const dynamicImports = await this.getImports(options);
    const finalImports = imports.concat(dynamicImports);

    const providers = await this.getProviders(options);
    return {
      module: CombineNestClientModule,
      providers: providers,
      imports: finalImports,
    };
  }
  private static async getImports(
    options: CombineAPIConnectionAsyncOptions,
  ): Promise<DynamicModule[]> {
    return [
      ...options.imports,
      {
        module: ApiModule,
        providers: [
          {
            provide: CombineAPIConfiguration,
            useFactory: options.useFactory,
            inject: [ConfigService],
          },
        ],
      },
    ];
  }
  private static async getProviders(
    options: CombineAPIConnectionAsyncOptions,
  ): Promise<Provider<CombineAPIConfiguration>[]> {
    {
      return [
        {
          provide: CombineAPIConfiguration,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
      ];
    }
  }
}
