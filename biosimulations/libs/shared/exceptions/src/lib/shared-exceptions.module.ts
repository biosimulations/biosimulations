import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { BiosimulationsExceptionFilter } from './biosimulations-exception.filter';

@Module({
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: BiosimulationsExceptionFilter,
    },
  ],
  exports: [],
})
export class SharedExceptionsModule {}
