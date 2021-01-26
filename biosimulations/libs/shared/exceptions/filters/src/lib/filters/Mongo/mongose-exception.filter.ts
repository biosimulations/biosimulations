import { ErrorResponseDocument } from '@biosimulations/datamodel/api';
import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import * as mongoose from 'mongoose';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StrictModeError } from './strict-mode-exception';

@Injectable()
export class MongooseErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // next.handle() is an Observable of the controller's result value
    return next.handle().pipe(
      catchError((error) => {
        if (error.name == 'StrictModeError') {
          throw new StrictModeError(error.path, error.message, error.immutable);
        } else {
          throw error;
        }
      }),
    );
  }
}
