import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { makeErrorObjectFromHttp } from './utils';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private logger = new Logger(HttpExceptionFilter.name);

  public catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    this.logger.error(exception);
    this.logger.error(request.url);
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const err = makeErrorObjectFromHttp(exception);
    this.logger.log(err);
    response.status(status).json({ error: [err] });
  }
}
