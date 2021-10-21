import { ErrorResponseDocument } from '@biosimulations/datamodel/api';
import { FormatService } from '@biosimulations/shared/services';
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
  private logger = new Logger(DefaultFilter.name);
  public catch(exception: any, host: ArgumentsHost): void {
    this.logger.error(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let title = 'Internal Server Error';
    let detail = 'An unexpected error occurred';

    if (
      'status' in exception &&
      Number.isInteger(exception.status) &&
      'message' in exception
    ) {
      status = exception.status.toString();
      title = exception.message;

      if (status === 413) {
        detail = `The submitted ${FormatService.formatDigitalSize(
          exception.length,
          1024,
        )} payload is too large. Payloads are limited to ${FormatService.formatDigitalSize(
          exception.limit,
          1024,
        )}.`;
      }
    }
    const statusString = status.toString();
    const resbody = {
      status: statusString,
      title,
      detail,
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
