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
import { AdminGuard } from '../admin/admin.guard';

@Injectable()
export class PermissionsGuard {
  constructor(
    private readonly reflector: Reflector,
    private admin: AdminGuard
  ) { }

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const routePermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler()
    );

    const user: AuthToken = context.getArgs()[0].user;
    let userPermissions = user['https://biosimulations.org/permissions'];
    const autoPerimissions = user['permissions'] || []
    userPermissions = userPermissions.concat(autoPerimissions)

    const hasPermission = () =>
      routePermissions.every((routePermission) =>
        userPermissions?.includes(routePermission)
      );

    //const isAdmin = this.admin.isAdmin(user);

    if (hasPermission()) {
      return true;
    } else {
      throw new ForbiddenException(
        'You do not have the needed permissions: ' + routePermissions.toString()
      );
    }
  }
}
