import { ErrorResponseDocument } from '@biosimulations/shared/datamodel-api';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class DefaultFilter implements ExceptionFilter {
  responseDocument!: ErrorResponseDocument;

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let resbody = {
      status: HttpStatus.INTERNAL_SERVER_ERROR.toString(),
      title: 'Internal Server Error',
      meta: {
        time: Date.now(),
        url: request.url,
      },
    };
    const responseError: ErrorResponseDocument = { error: [resbody] };
    response.status(status).json(responseError);
  }
}
