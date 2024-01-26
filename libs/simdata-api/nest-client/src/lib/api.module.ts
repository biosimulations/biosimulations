import { DynamicModule, Module, Global, Provider } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { AsyncConfiguration, Configuration, ConfigurationFactory } from './configuration';

import { DefaultService } from './api/default.service';

@Global()
@Module({
  imports:      [ HttpModule ],
  exports:      [
    DefaultService
  ],
  providers: [
    DefaultService
  ]
})
export class ApiModule {
    public static forRoot(configurationFactory: () => Configuration): DynamicModule {
        return {
            module: ApiModule,
            providers: [ { provide: Configuration, useFactory: configurationFactory } ]
        };
    }

    /**
     * Register the module asynchronously.
     */
    static forRootAsync(options: AsyncConfiguration): DynamicModule {
        const providers = [...this.createAsyncProviders(options)];
        return {
            module: ApiModule,
            imports: options.imports || [],
            providers,
            exports: providers,
        };
    }

    private static createAsyncProviders(options: AsyncConfiguration): Provider[] {
        if (options.useExisting || options.useFactory) {
            return [this.createAsyncConfigurationProvider(options)];
        }
        if (!options.useClass) {
            throw new Error(
                'Invalid configuration. Must provide useClass, useExisting or useFactory',
            );
        }
        return [
            this.createAsyncConfigurationProvider(options),
            {
                provide: options.useClass,
                useClass: options.useClass,
            },
        ];
    }

    private static createAsyncConfigurationProvider(
        options: AsyncConfiguration,
    ): Provider {
        if (options.useFactory) {
            return {
                provide: Configuration,
                useFactory: options.useFactory,
                inject: options.inject || [],
            };
        }
        const existing_or_class = options.useExisting || options.useClass;
        if (!existing_or_class) {
            throw new Error(
                'Invalid configuration. Must provide useClass, useExisting or useFactory',
            );
        }
        return {
            provide: Configuration,
            useFactory: async (optionsFactory: ConfigurationFactory) =>
                await optionsFactory.createConfiguration(),
            inject: [existing_or_class],
        };
    }

    constructor( httpService: HttpService) { }
}
