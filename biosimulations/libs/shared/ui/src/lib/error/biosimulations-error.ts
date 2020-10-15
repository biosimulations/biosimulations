export class BiosimulationsError extends Error {
  details: string;
  code: number;

  constructor(message: string, details: string, code: number = 500) {
    super(message);
    this.details = details;
    this.code = code;
  }
}
