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
  private ignorePaths = ['/health'];

  private logger = new Logger(HttpExceptionFilter.name);

  public catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    this.logger.error(exception.getResponse(), request.url);
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    let ignore = false;
    this.ignorePaths.forEach((path) => {
      if (request.url.startsWith(path)) {
        ignore = true;
      }
    });
    if (ignore) {
      response.status(status).json(exception.getResponse());
    } else {
      const err = makeErrorObjectFromHttp(exception);
      response.status(status).json({ error: [err] });
    }
  }
}
