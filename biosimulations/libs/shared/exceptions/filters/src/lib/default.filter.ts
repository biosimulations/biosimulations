import { ErrorResponseDocument } from '@biosimulations/datamodel/api';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class DefaultFilter implements ExceptionFilter {
  responseDocument!: ErrorResponseDocument;
  private logger = new Logger(DefaultFilter.name);
  public catch(exception: any, host: ArgumentsHost): void {
    this.logger.error(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const resbody = {
      status: HttpStatus.INTERNAL_SERVER_ERROR.toString(),
      title: 'Internal Server Error',
      meta: {
        time: Date.now(),
        url: request.url,
      },
    };
    console.error(exception);
    const responseError: ErrorResponseDocument = { error: [resbody] };
    this.logger.log(responseError);
    response.status(status).json(responseError);
  }
}
