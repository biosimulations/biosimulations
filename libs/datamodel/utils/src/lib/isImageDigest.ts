import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  isHash,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function IsImageDigest(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
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
    if (!(value && typeof value === 'string')) {
      return false;
    }

    if (!value.startsWith('sha256:')) {
      return false;
    }

    const hash = value.substring(7);
    if (!isHash(hash, 'sha256')) {
      return false;
    }

    return true;
  }

  public defaultMessage(validationArguments?: ValidationArguments): string {
    return 'An image digest must be a valid sha256 hash with the "sha256:" prefix';
  }
}
