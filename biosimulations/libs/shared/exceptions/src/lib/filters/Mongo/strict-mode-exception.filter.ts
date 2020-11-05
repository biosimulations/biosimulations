import {
  ErrorObject,
  ErrorResponseDocument,
} from '@biosimulations/datamodel/api';
import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

import { StrictModeError } from './strict-mode-exception';
import { makeErrorObject } from '../../utils';
@Catch(StrictModeError)
export class StrictModeExceptionFilter implements ExceptionFilter {
  catch(err: StrictModeError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errors: ErrorObject[] = [];
    const errorObject = makeErrorObject(
      HttpStatus.BAD_REQUEST,
      'Extra Fields Error',
      'The input object contains fields that are not a part of the schema',
      undefined,
      undefined,
      undefined,
      err.path
    );
    errors.push(errorObject);

    const responseError: ErrorResponseDocument = { error: errors };
    response.status(HttpStatus.BAD_REQUEST).json(responseError);
  }
}
