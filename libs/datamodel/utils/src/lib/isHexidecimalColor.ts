import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function IsHexidecimalColor(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isHexidecimalColor',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsHexidecimalColorConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'isHexidecimalColor' })
export class IsHexidecimalColorConstraint
  implements ValidatorConstraintInterface
{
  public validate(value: any, args?: ValidationArguments): boolean {
    if (!value || typeof value !== 'string') {
      return false;
    }

    if (!value.match(/^([a-f0-9]{6,6}|[a-f0-9]{8,8})$/i)) {
      return false;
    }

    return true;
  }

  public defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Colors must be 6 or 8-digit case-insensitive hexidecimal strings (e.g., 00FF00 or FF0000CC)';
  }
}
