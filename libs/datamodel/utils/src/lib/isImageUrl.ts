import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import isUrl from 'is-url';

export function IsImageUrl(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isImageUrl',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsImageUrlConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'isImageUrl' })
export class IsImageUrlConstraint implements ValidatorConstraintInterface {
  public validate(value: any, args?: ValidationArguments): boolean {
    if (!value || typeof value !== 'string') {
      return false;
    }

    if (
      !isUrl('https://' + value) ||
      value.startsWith('http://') ||
      value.startsWith('https://')
    ) {
      return false;
    }

    const iTag = value.lastIndexOf(':');
    if (iTag === -1 || value.endsWith(':')) {
      return false;
    }

    const tag = value.substring(iTag + 1);
    if (tag === 'latest') {
      return false;
    }

    if (!tag.match(/^[a-zA-Z0-9_.-]+$/)) {
      return false;
    }

    return true;
  }

  public defaultMessage(validationArguments?: ValidationArguments): string {
    return 'An image URL must be a valid URL without a protocol and with a tag other than `latest` (e.g., `ghcr.io/biosimulators/tellurium:2.2.1`)';
  }
}
