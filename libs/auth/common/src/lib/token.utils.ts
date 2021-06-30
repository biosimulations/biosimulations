import jwt from 'jsonwebtoken';
import { AuthToken } from './authToken';

export function decodeToken(token: string): AuthToken {
  const decoded = jwt.decode(token);
  return decoded as AuthToken;
}

export function isTokenCurrent(token: string): boolean {
  const tokenDecode = decodeToken(token);
  // Seconds to milliseconds
  const exp_time = tokenDecode.exp * 1000;
  const time_now = Date.now();

  return exp_time - time_now > 0;
}

export function hasAudience(token: string, audience: string): boolean {
  const tokenDecode = decodeToken(token);
  const aud = tokenDecode.aud;
  return aud == audience;
}
export function getUserId(token: string) {
  return decodeToken(token)?.sub;
}
