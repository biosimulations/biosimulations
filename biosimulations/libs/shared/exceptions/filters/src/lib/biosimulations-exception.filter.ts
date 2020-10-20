import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorObject } from '@biosimulations/shared/datamodel-api';
@Catch()
export class BiosimulationsExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    let errors: ErrorObject[] = [];
    response.status(status).json({
      errors: [
        {
          status: status,
          code: '',
          title: '',
          detail: '',
          source: '',
          meta: {
            timestamp: new Date().toISOString(),
            path: request.url,
          },
        },
      ],
    });
  }
}
