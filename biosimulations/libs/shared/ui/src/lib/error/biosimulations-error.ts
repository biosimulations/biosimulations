export class BiosimulationsError extends Error {
  details: string;
  code: number | string;

  constructor(message: string, details: string, code: number | string = '') {
    super(message);
    this.details = details;
    this.code = code;
  }
}
