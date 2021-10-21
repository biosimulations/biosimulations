import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponseDocument, ErrorObject } from '@biosimulations/datamodel/common';
import { FormatService } from '@biosimulations/shared/services';

/**
 * Filter to provide more informative error messages with NestJS, particularly for payload too large errors.
 * NestJS provides uniformative messages for some errors which it doesn't properly identify as HTTP exceptions.
 * 
 * This error is discussed in https://github.com/nestjs/nest/issues/5191. https://github.com/nestjs/nest/pull/5990
 * is an open pull request to address the issue.
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status!: number;
    const errorObj: ErrorObject = {};

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      errorObj.status = status.toString();
      const exceptionResponse: any = exception.getResponse();
      errorObj.title = exceptionResponse.error || exceptionResponse.message;
      errorObj.detail = exceptionResponse.message || exceptionResponse.error;
    
    } else if ('status' in exception && Number.isInteger(exception.status) && 'message' in exception) {
      status = exception.status;
      errorObj.status = status.toString();
      errorObj.title = exception.message;

      if (status === 413) {
        errorObj.detail = `The submitted ${FormatService.formatDigitalSize(exception.length, 1024)} payload is too large. Payloads are limited to ${FormatService.formatDigitalSize(exception.limit, 1024)}.`;
      } else {
        errorObj.detail = errorObj.title;
      }
    
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorObj.status = status.toString();
      errorObj.title = 'Internal Server Error';
      errorObj.detail = errorObj.title;
    }

    const errorDoc: ErrorResponseDocument = {
      error: [errorObj],
    };
    response.status(status).json(errorDoc);
  }
}
