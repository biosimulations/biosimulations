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

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private jwt: JwtGuard) {}
  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();

    //The user should be placed by the JWT strategy
    //await this.jwt.canActivate(context);
    const user = request.user as any;

    if (user?.['https://biosimulations.org/roles']?.includes('admin')) {
      return true;
    } else {
      throw new ForbiddenException('You do not have the Admin Role');
    }
  }
}
