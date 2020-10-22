import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { BiosimulationsExceptionFilter } from './biosimulations-exception.filter';
import { DefaultFilter } from './default.filter';
import { HttpExceptionFilter } from './http-exception.filter';
import { ValidationExceptionFilter } from './validation-exception.filter';

@Module({
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: BiosimulationsExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: DefaultFilter,
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
export class SharedExceptionsModule {}
