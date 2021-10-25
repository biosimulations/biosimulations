import { HttpStatus, ValidationError } from '@nestjs/common';
import { BiosimulationsException } from './exception';
import { inspect } from 'util';
export const BiosimulationsValidationExceptionFactory = (
  errors: ValidationError[],
): BiosimulationsException => {
  // TODO handle multiple errors
  // TODO parse the validation error to create readable error messages
  // Need to recursively parse the errors and children, get the path names, and the eror message for each
  const err = errors[0];
  const message = `Parameter or property '${
    err.property
  }''  with value ${inspect(err.value)} failed validation`;

  const bioSimErr = new BiosimulationsException(
    HttpStatus.BAD_REQUEST,
    'Validation Error',
    message,
    undefined,
    undefined,
    err.property,
    undefined,
    [...errors],
  );

  return bioSimErr;
};
