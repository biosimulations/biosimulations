import { HttpStatus, ValidationError } from '@nestjs/common';
import { BiosimulationsException } from './exception';

export const BiosimulationsValidationExceptionFactory = (
  errors: ValidationError[],
): BiosimulationsException => {
  const err = errors[0];
  const message = err.property + 'failed validation';

  const bioSimErr = new BiosimulationsException(
    HttpStatus.BAD_REQUEST,
    'Validation Error',
    message,
    undefined,
    undefined,
    err.property,
    undefined,
    { errors: errors },
  );

  return bioSimErr;
};
