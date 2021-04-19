export interface ValidationMessage {
  _type: 'ValidationMessage';
  summary: string;
  details?: ValidationMessage[];
}

export enum ValidationStatus {
  valid = 'valid',
  invalid = 'invalid',
  warnings = 'warnings',
}

export interface ValidationReport {
  _type: 'ValidationReport';
  status: ValidationStatus;
  errors?: ValidationMessage[];
  warnings?: ValidationMessage[];
}
