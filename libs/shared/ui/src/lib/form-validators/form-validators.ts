import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { ConfigService } from '@biosimulations/config/angular';
import isUrl from 'is-url';

export const URL_VALIDATOR: ValidatorFn = function (control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value || isUrl(value)) {
    return null;
  }
  return { url: true };
};

export const NON_NEGATIVE_FLOAT_VALIDATOR: ValidatorFn = function (control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (isNaN(value) || value < 0) {
    return { nonNegativeFloat: true };
  }
  return null;
};

export const POSITIVE_INTEGER_VALIDATOR: ValidatorFn = function (control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (isNaN(value) || value <= 0 || Math.floor(value) !== value) {
    return { positiveInteger: true };
  }
  return null;
};

export const INTEGER_VALIDATOR: ValidatorFn = function (control: AbstractControl): ValidationErrors | null {
  const value = control.value as number;
  if (value == Math.floor(value)) {
    return null;
  }
  return { integer: true };
};

export const UNIFORM_TIME_SPAN_VALIDATOR: ValidatorFn = function (control: AbstractControl): ValidationErrors | null {
  const initialTime = control.get('initialTime')?.value;
  const outputStartTime = control.get('outputStartTime')?.value;
  const outputEndTime = control.get('outputEndTime')?.value;

  if (isNaN(initialTime) || isNaN(outputStartTime) || isNaN(outputEndTime)) {
    return null;
  }

  const errors: ValidationErrors = {};
  if (initialTime > outputStartTime) {
    errors['initialTimeGreaterThanOutputStartTime'] = true;
  }
  if (outputStartTime > outputEndTime) {
    errors['outputStartTimeGreaterThanOutputEndTime'] = true;
  }

  if (Object.keys(errors).length) {
    return errors;
  }

  return null;
};

export const SEDML_ID_VALIDATOR: ValidatorFn = function (control: AbstractControl): ValidationErrors | null {
  const idPattern = /^[a-z_][a-z0-9_]+$/i;
  const value = control.value;
  if (value && control.value.match(idPattern)) {
    return null;
  }
  return { validSedmlId: true };
};

export const NAMESPACE_PREFIX_VALIDATOR: ValidatorFn = function (control: AbstractControl): ValidationErrors | null {
  const prefixPattern = /^[a-z_][a-z_0-9\-.]+$/i;
  const value = control.value;
  if (!value || (value && control.value.match(prefixPattern))) {
    return null;
  }
  return { validNamespacePrefix: true };
};

export const UNIQUE_ATTRIBUTE_VALIDATOR_CREATOR = function (attrName: string): ValidatorFn {
  return function (control: AbstractControl): ValidationErrors | null {
    const values = control.value;

    const attributes = values.map((value: any): string => {
      return value?.[attrName];
    });

    const uniqueValues = new Set<string>(attributes);
    if (uniqueValues.size === values.length) {
      return null;
    }

    const error: ValidationErrors = {};
    error[attrName + 'Unique'] = true;
    return error;
  };
};

export function CreateMaxFileSizeValidator(config: ConfigService): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const maxSize = config.appConfig?.maxUploadFileSize;
    const fileValue = control.value?.files?.[0];
    if (!fileValue || isNaN(maxSize) || fileValue.size <= maxSize) {
      return null;
    }
    return { maxSize: true };
  };
}
