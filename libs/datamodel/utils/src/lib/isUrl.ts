import { ValidationOptions, ValidationArguments, isURL, IS_URL, buildMessage, ValidateBy } from 'class-validator';
import ValidatorJS from 'validator';

export type IsURLOptions = ValidatorJS.IsURLOptions & {
  allowDecodedUrls?: boolean;
};

export function IsUrl(options?: IsURLOptions, validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_URL,
      constraints: [options],
      validator: {
        validate: (value: any, args?: ValidationArguments): boolean => {
          return isUrlConstraint(value, options);
        },
        defaultMessage: buildMessage(
          (eachPrefix) => eachPrefix + '$property must be an URL address',
          validationOptions,
        ),
      },
    },
    validationOptions,
  );
}

export function isUrlConstraint(value: any, options?: IsURLOptions): boolean {
  if (options?.allowDecodedUrls === true) {
    value = encodeURI(value);
  }
  return isURL(value, options);
}
