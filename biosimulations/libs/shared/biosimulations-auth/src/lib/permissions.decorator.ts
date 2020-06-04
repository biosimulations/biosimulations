import { SetMetadata } from '@nestjs/common';

export const permissions = (...args: string[]) =>
  SetMetadata('permissions', args);
