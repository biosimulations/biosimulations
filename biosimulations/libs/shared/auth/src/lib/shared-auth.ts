let jwt = require('jsonwebtoken');

/**
 * This functions decodes a well formed token and returns the payload.
 * It is essentially a wrapper around the Auth0 jwt library, with included type information about the payload shape.
 * This function DOES NOT fully validate the token and returned information should not be considered trusted
 * @export
 *
 */
export function decodeJWT(token: string): any {
  return jwt.decode(token);
}
