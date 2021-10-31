import { IdToken } from '@biosimulations/auth/common';

export function isAdmin(user: IdToken): boolean {
  return user?.['https://biosimulations.org/roles']?.includes('admin');
}
