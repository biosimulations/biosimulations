import { ErrorResponseDocument } from '@biosimulations/datamodel/api';
import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import * as mongoose from 'mongoose';

import { makeErrorObject } from '../../utils';

@Catch(mongoose.Error.ValidationError)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(err: mongoose.Error.ValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errors = [];

    for (const key in err.errors) {
      const validatorError:
        | mongoose.Error.ValidatorError
        | mongoose.Error.CastError = err.errors[key];
      const path = ('/' + key).replace(new RegExp('\\.', 'g'), '/'); //Change the "." in the path to  "/" to make a valid JSON path as per RFC 6901
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
    response.status(HttpStatus.BAD_REQUEST).json(responseError);
  }
}
