import { Schema, SchemaType } from 'mongoose';

interface PathOptions {
  isRequired: any;
  defaultValue: any;
}

interface SchemaPaths {
  [key: string]: PathOptions;
}

function getSchemaUserPaths(schema: Schema): SchemaPaths {
  const userPaths: { [key: string]: PathOptions } = {};
  Object.entries(schema.paths).forEach((pathSchemaType: [string, SchemaType]): void => {
    const path = pathSchemaType[0];
    const schemaType = pathSchemaType[1];

    if (path === "_id" || path === "__v") {
      return;
    }

    const timestamps = schema.get('timestamps');
    const timestampPaths = timestamps === undefined ? null : Object.values(timestamps);
    if (timestampPaths && timestampPaths.includes(path)) {
      return;
    }

    userPaths[path] = getSchemaTypeOptions(schemaType);
  });
  return userPaths;
}

function getSchemaTypeOptions(schemaType: SchemaType): PathOptions {
  let isRequired: any = undefined;
  let defaultValue: any = undefined;

  Object.entries(schemaType).forEach((keyVal: [string, any]): void => {
    const key = keyVal[0];
    const val = keyVal[1];
    if (key === "isRequired") {
      isRequired = val;
    }
    if (key === "defaultValue") {
      defaultValue = val;
    }
  });

  return { isRequired, defaultValue };
}

export function addValidationForNullableAttributes(schema: Schema): void {
  Object.entries(getSchemaUserPaths(schema)).forEach((pathOptions: [string, PathOptions]): void => {
    const path = pathOptions[0];
    const options = pathOptions[1];

    if (options.isRequired !== true && options.isRequired !== false) {
      throw new Error(`'required' should be explicitly set for '${path}'`);
    }
  });

  schema.pre('validate', function (next): void {
    Object.entries(getSchemaUserPaths(schema)).forEach((pathOptions: [string, PathOptions]): void => {
      const path = pathOptions[0];
      const options = pathOptions[1];

      if (path === "recommendedRange") {
        console.log(options.isRequired, options.isRequired === undefined)
      }

      if (options.isRequired === false) {
        console.log(path)

        if (this.get(path) === undefined) {
          if (options.defaultValue === undefined) {
            this.invalidate(path, `'${path}' attribute must be defined`);
          } else {
            this.set(path, options.defaultValue);
          }
        }
      }
    })
    next();
  });
}
