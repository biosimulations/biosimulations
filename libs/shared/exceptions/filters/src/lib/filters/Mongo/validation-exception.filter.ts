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
    // Mongo can retun an array of errors, or a single error, so we want to include all the information for the user
    for (const key in err.errors) {
      const validatorError:
        | mongoose.Error.ValidatorError
        | mongoose.Error.CastError
        | mongoose.Error.ValidationError = err.errors[key];

      //Change the "." in the path to  "/" to make a valid JSON path as per RFC 6901
      const path = ('/' + key).replace(new RegExp('\\.', 'g'), '/');
      const error = makeErrorObject(
        HttpStatus.INTERNAL_SERVER_ERROR,
        // Specify that this is a database issue
        'Database ' + validatorError.name,
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
    /* Return a 500 error since this is a validation error at the database level
     * It is the developers/API responsibility to make sure data sent to the database is valid
     * If the user provides a bad input, this should be caught before trying to save to the database,
     * in the API validation layer. That layer should return a 400 error.
     * This is a fallback for when the API validation layer misses something, and should be corrected.
     * */

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(responseError);
  }
}
