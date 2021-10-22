import {
  ErrorObject,
  ErrorResponseDocument,
} from '@biosimulations/datamodel/api';
import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import * as mongo from 'mongodb';
import { makeErrorObject } from '../../utils';

@Catch(mongo.MongoError)
export class MongoErrorFilter implements ExceptionFilter {
  private logger = new Logger(MongoErrorFilter.name);

  public catch(err: mongo.MongoError, host: ArgumentsHost): void {
    this.logger.error(err);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const errors: ErrorObject[] = [];
    const code = err.code;
    switch (code) {
      case 11000: {
        const error = makeErrorObject(
          HttpStatus.CONFLICT,
          'Key Conflict',
          `The value for a unique key was already present in the database`,
          undefined,
          undefined,
          undefined,
          err.message.split('dup key: ')[1],
          undefined,
          err,
        );
        errors.push(error);
        break;
      }
      default: {
        const error = makeErrorObject(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Database Error',
          err.message,
          undefined,
          undefined,
          undefined,
          err.errmsg,
          undefined,
          undefined,
        );
        errors.push(error);
      }
    }

    const responseError: ErrorResponseDocument = { error: errors };
    this.logger.log(responseError);
    response.status(HttpStatus.CONFLICT).json(responseError);
  }
}
