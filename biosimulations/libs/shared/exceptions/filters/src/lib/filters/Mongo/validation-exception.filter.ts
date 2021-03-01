import { ErrorResponseDocument } from '@biosimulations/datamodel/api';
import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import * as mongoose from 'mongoose';

import { makeErrorObject } from '../../utils';

@Catch(mongoose.Error.ValidationError)
export class ValidationExceptionFilter implements ExceptionFilter {
  private logger = new Logger(ValidationExceptionFilter.name);
  public catch(err: mongoose.Error.ValidationError, host: ArgumentsHost): void {
    this.logger.error(err);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const errors = [];

    for (const key in err.errors) {
      const validatorError:
        | mongoose.Error.ValidatorError
        | mongoose.Error.CastError = err.errors[key];
      //Change the "." in the path to  "/" to make a valid JSON path as per RFC 6901
      const path = ('/' + key).replace(new RegExp('\\.', 'g'), '/');
      const error = makeErrorObject(
        HttpStatus.BAD_REQUEST,
        validatorError.name,
        validatorError.message,
        undefined,
        undefined,
        undefined,
        path,
      );
      errors.push(error);
    }

    const responseError: ErrorResponseDocument = { error: errors };
    this.logger.log(responseError);
    response.status(HttpStatus.BAD_REQUEST).json(responseError);
  }
}
