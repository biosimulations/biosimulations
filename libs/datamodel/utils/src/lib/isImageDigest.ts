import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  isHash,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function IsImageDigest(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isImageDigest',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsImageDigestConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'isImageDigest' })
export class IsImageDigestConstraint implements ValidatorConstraintInterface {
  public validate(value: any, args?: ValidationArguments): boolean {
    const isString = value && typeof value === 'string';
    const hasPrefix = value.startsWith('sha256:');
    const hash = hasPrefix ? value.substring(7) : value;
    const isValidHash = isHash(hash, 'sha256');
    return isString && isValidHash && hasPrefix;
  }

  public defaultMessage(validationArguments?: ValidationArguments): string {
    return 'An image digest must be a valid sha256 hash with the "sha256:" prefix';
  }
}
