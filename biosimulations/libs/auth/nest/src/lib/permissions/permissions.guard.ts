/**
 * copied from https://auth0.com/blog/developing-a-secure-api-with-nestjs-adding-role-based-access-control
 */

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { JwtGuard } from '../jwt/jwt.guard';
import { AuthToken } from '@biosimulations/auth/common';
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private jwt: JwtGuard) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const routePermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler()
    );

    await this.jwt.canActivate(context);
    const user: AuthToken = context.getArgs()[0].user;
    const userPermissions = user['https://biosimulations.org/permissions'];

    console.log(routePermissions);
    console.log(userPermissions);

    const hasPermission = () =>
      routePermissions.every((routePermission) =>
        userPermissions?.includes(routePermission)
      );
    if (hasPermission()) {
      return true;
    } else {
      throw new ForbiddenException(
        'You do not have permission to make this call'
      );
    }
  }
}
