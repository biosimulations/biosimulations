import { HttpStatus, ValidationError } from '@nestjs/common';
import { BiosimulationsException } from './exception';

export const BiosimulationsValidationExceptionFactory = (
  errors: ValidationError[],
): BiosimulationsException => {
  // TODO handle all errors, not just first one
  const err = errors[0];
  const message =
    'Parameter or property "' + err.property + '" failed validation';

  const bioSimErr = new BiosimulationsException(
    HttpStatus.BAD_REQUEST,
    'Validation Error',
    message,
    undefined,
    undefined,
    err.property,
    undefined,
    { ...err },
  );

  return bioSimErr;
};
