import { AuthGuard } from '@nestjs/passport';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from '../jwt/jwt.guard';
import { Observable } from 'rxjs';
import { IdToken } from '@biosimulations/auth/common';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor() {}
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();

    const user = (request.user as any) as IdToken;

    if (user?.['https://biosimulations.org/roles']?.includes('admin')) {
      return true;
    } else {
      throw new ForbiddenException('You do not have the Admin Role');
    }
  }
}
