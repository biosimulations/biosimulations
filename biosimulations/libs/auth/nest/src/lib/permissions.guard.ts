/**
 * copied from https://auth0.com/blog/developing-a-secure-api-with-nestjs-adding-role-based-access-control
 */

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const routePermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    const userPermissions = context.getArgs()[0].user.permissions || [];

    if (!routePermissions) {
      return true;
    }

    const hasPermission = () =>
      routePermissions.every((routePermission) =>
        userPermissions.includes(routePermission),
      );

    return hasPermission();
  }
}
