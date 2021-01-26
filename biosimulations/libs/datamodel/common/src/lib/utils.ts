import { isValidObjectId, Schema, SchemaType } from 'mongoose';
import { Url, UrlType } from './common/url';

interface PathOptions {
  readOnly: boolean;
  isRequired: any;
  defaultValue: any;
}

interface SchemaPaths {
  [key: string]: PathOptions;
}

function getSchemaUserPaths(schema: Schema): SchemaPaths {
  const userPaths: { [key: string]: PathOptions } = {};
  Object.entries(schema.paths).forEach(
    (pathSchemaType: [string, SchemaType]): void => {
      const path = pathSchemaType[0];
      const schemaType = pathSchemaType[1];

      if (path === '_id' || path === '__v') {
        userPaths[path] = {
          readOnly: true,
          isRequired: undefined,
          defaultValue: undefined,
        };
        return;
      }

      const timestamps = schema.get('timestamps');
      const timestampPaths =
        timestamps === undefined ? null : Object.values(timestamps);
      if (timestampPaths && timestampPaths.includes(path)) {
        userPaths[path] = {
          readOnly: true,
          isRequired: undefined,
          defaultValue: undefined,
        };
        return;
      }

      userPaths[path] = getSchemaTypeOptions(path, schemaType);
    },
  );
  return userPaths;
}

function getSchemaTypeOptions(
  path: string,
  schemaType: SchemaType,
): PathOptions {
  let isRequired: any = undefined;
  let defaultValue: any = undefined;

  if (!Object.keys(schemaType).includes('isRequired')) {
    throw new Error(`'required' should be explicitly set for ${path}`);
  }

  if (!Object.keys(schemaType).includes('defaultValue')) {
    throw new Error(`'default' should be explicitly set for ${path}`);
  }

  Object.entries(schemaType).forEach((keyVal: [string, any]): void => {
    const key = keyVal[0];
    const val = keyVal[1];
    if (key === 'isRequired') {
      isRequired = val;
    }
    if (key === 'defaultValue') {
      defaultValue = val;
    }
  });

  return { readOnly: false, isRequired, defaultValue };
}

export function addValidationForNullableAttributes(schema: Schema<any>): void {
  Object.entries(schema).forEach((keyVal: [string, any[]]): void => {
    const key = keyVal[0];
    const val = keyVal[1];
    if (key === 'childSchemas') {
      val.forEach((childSchema: any): void => {
        addValidationForNullableAttributes(childSchema.schema);
      });
    }
  });

  Object.entries(getSchemaUserPaths(schema)).forEach(
    (pathOptions: [string, PathOptions]): void => {
      const path = pathOptions[0];
      const options = pathOptions[1];

      if (
        !options.readOnly &&
        options.isRequired !== true &&
        options.isRequired !== false
      ) {
        throw new Error(`'required' should be explicitly set for '${path}'`);
      }
    },
  );

  schema.pre('validate', function (next): void {
    Object.entries(getSchemaUserPaths(schema)).forEach(
      (pathOptions: [string, PathOptions]): void => {
        const path = pathOptions[0];
        const options = pathOptions[1];

        if (!options.readOnly) {
          if (options.isRequired === false) {
            if (this.get(path) === undefined) {
              if (options.defaultValue === undefined) {
                this.invalidate(path, `'${path}' attribute must be defined`);
              } else {
                this.set(path, options.defaultValue);
              }
            }
          }
        }
      },
    );
    next();
  });
}

export function sortUrls(a: Url, b: Url): number {
  if (a.type === b.type) {
    return 0;
  }

  let aVal = 0;
  let bVal = 0;
  for (const [val, label] of Object.entries(UrlType)) {
    if (label === a.type) {
      aVal = parseInt(val.substring(5));
    }

    if (label === b.type) {
      bVal = parseInt(val.substring(5));
    }
  }

  if (aVal < bVal) {
    return -1;
  } else {
    return 1;
  }
}

export const omitPrivate = (doc: any, obj: any) => {
  delete obj.__v;
  delete obj._id;

  return obj;
};
export const ObjectIdValidator = (id: any): boolean => {
  return isValidObjectId(id);
};
