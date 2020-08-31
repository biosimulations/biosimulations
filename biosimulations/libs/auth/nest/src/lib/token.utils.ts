import jwt from 'jsonwebtoken';

export function decodeToken(token: string): any {
  const decoded = jwt.decode(token);
  return decoded;
}

export function getUserId(token: string) {
  return decodeToken(token)?.user_id;
}
