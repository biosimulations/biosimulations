import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { BiosimulationsExceptionFilter } from './biosimulations-exception.filter';
import { DefaultFilter } from './default.filter';
import { MongoErrorFilter } from './filters/Mongo/MongoError';
import { MongooseErrorInterceptor } from './filters/Mongo/mongose-exception.filter';

import { StrictModeExceptionFilter } from './filters/Mongo/strict-mode-exception.filter';
import { ValidationExceptionFilter } from './filters/Mongo/validation-exception.filter';
import { HttpExceptionFilter } from './http-exception.filter';

@Module({
  controllers: [],
  providers: [
    // ENSURE that the defualt filter is provided first! Filters catch from the bottom up
    {
      provide: APP_FILTER,
      useClass: DefaultFilter,
    },
    // Keep mongose filter above other mongo errors
    {
      provide: APP_INTERCEPTOR,
      useClass: MongooseErrorInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: MongoErrorFilter,
    },

    {
      provide: APP_FILTER,
      useClass: BiosimulationsExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: StrictModeExceptionFilter,
    },

    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ValidationExceptionFilter,
    },
  ],
  exports: [],
})
export class SharedExceptionsFiltersModule {}
