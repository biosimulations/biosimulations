import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StrictModeError } from './strict-mode-exception';

@Injectable()
export class MongooseErrorInterceptor implements NestInterceptor {
  private logger = new Logger(MongooseErrorInterceptor.name);

  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    // next.handle() is an Observable of the controller's result value
    return next.handle().pipe(
      catchError((error) => {
        if (error.name == 'StrictModeError') {
          this.logger.error(error);
          throw new StrictModeError(error.path, error.message, error.immutable);
        } else {
          throw error;
        }
      }),
    );
  }
}
