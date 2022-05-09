import { HttpStatus, ValidationError } from '@nestjs/common';
import { BiosimulationsException } from './exception';
import { inspect } from 'util';

export const BiosimulationsValidationExceptionFactory = (errors: ValidationError[]): BiosimulationsException => {
  const message = errors.map(getErrorMesage).join('\n\n');

  const bioSimErr = new BiosimulationsException(
    HttpStatus.BAD_REQUEST,
    'Object is invalid',
    message,
    undefined,
    undefined,
    undefined,
    undefined,
    [...errors],
  );

  return bioSimErr;
};

function getErrorMesage(error: ValidationError, level = 0): string {
  let msg = `${level === 0 ? 'Property or parameter' : 'Property'} '${error.property}' is invalid.`;

  const inspectedValue = inspect(error.value).replace(/\n/g, '\n    ');
  msg += `\n\n  Value:\n    ${inspectedValue}`;

  msg += '\n\n  Error(s):';

  if (error?.constraints && Object.entries(error?.constraints).length) {
    msg += Object.entries(error?.constraints)
      .map((typeMessage: [string, string]): string => {
        return `\n    - ${typeMessage[0]}: ${typeMessage[1]}`;
      })
      .join('');
  }

  if (error?.children?.length) {
    msg +=
      '\n    - ' +
      error.children
        .map(getErrorMesage, level + 1)
        .join('\n')
        .replace(/\n/g, '\n      ');
  }

  return msg;
}
