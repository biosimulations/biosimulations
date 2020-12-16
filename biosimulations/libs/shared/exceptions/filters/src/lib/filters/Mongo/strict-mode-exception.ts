import * as mongoose from 'mongoose';

// Redefined from the mongoose js files due to missign type
export class StrictModeError {
  name: 'StrictModeError' = 'StrictModeError';
  path!: string;
  immutable!: boolean;
  msg!: string;
  constructor(path: string, message: string, immutable: boolean) {
    this.msg = message;
    this.immutable = immutable;
    this.path = path;
  }
}
