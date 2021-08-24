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

import { StrictModeError } from './strict-mode-exception';
import { makeErrorObject } from '../../utils';
@Catch(StrictModeError)
export class StrictModeExceptionFilter implements ExceptionFilter {
  private logger = new Logger(StrictModeExceptionFilter.name);

  public catch(err: StrictModeError, host: ArgumentsHost): void {
    this.logger.error(err);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const errors: ErrorObject[] = [];
    const errorObject = makeErrorObject(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'Extra Fields Error',
      'The input object contains fields that are not a part of the schema',
      undefined,
      undefined,
      undefined,
      err.path,
    );
    errors.push(errorObject);

    const responseError: ErrorResponseDocument = { error: errors };
    this.logger.log(responseError);
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(responseError);
  }
}
