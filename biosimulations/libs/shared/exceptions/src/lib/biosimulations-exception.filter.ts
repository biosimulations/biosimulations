import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorObject } from '@biosimulations/shared/datamodel-api';
import {
  BiosimulationsException,
  isBiosimulationsException,
} from './exception';
import { stat } from 'fs';
@Catch()
export class BiosimulationsExceptionFilter implements ExceptionFilter {
  catch(
    exception: HttpException | BiosimulationsException | any,
    host: ArgumentsHost
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let resbody: ErrorObject;
    if (isBiosimulationsException(exception)) {
      status = exception.getStatus();
      resbody = exception.getError();
    } else if (exception instanceof HttpException) {
      exception = BiosimulationsException.fromHTTP(exception);
      status = exception.getStatus();
      resbody = exception.getError();
      response.status(exception.getStatus()).json(exception.getError());
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;

      resbody = {
        status: HttpStatus.INTERNAL_SERVER_ERROR.toString(),
        title: 'Internal Server Error',
        detail: exception,
      };
    }
    response.status(status).json(resbody);
  }
}
