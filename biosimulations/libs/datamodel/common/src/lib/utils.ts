import { Schema, Document } from 'mongoose';

export function addValidationForNullableAttributes(schema: Schema, optionalAttributeDefaults: { [path: string]: any }): void {
  schema.pre('validate', function (next): void {
    for (const path in optionalAttributeDefaults) {
      if (this.get(path) === undefined) {
        if (optionalAttributeDefaults[path] === undefined) {
          this.invalidate(path, `'${path}' attribute must be defined`);
        } else {
          this.set(path, optionalAttributeDefaults[path]);
        }
      }
    }
    next();
  });
}
