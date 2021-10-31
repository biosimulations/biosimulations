import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { IdToken } from '@biosimulations/auth/common';
import { isAdmin } from './isAdmin';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();

    const user = request.user as any as IdToken;

    if (isAdmin(user)) {
      return true;
    } else {
      throw new ForbiddenException('You do not have the Admin Role');
    }
  }
}
