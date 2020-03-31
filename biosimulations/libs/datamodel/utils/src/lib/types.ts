// Largly lifted from github user osi-oswald https://github.com/microsoft/TypeScript/issues/1897#issuecomment-580962081

/**
 * Define a type for objects that are parsed from JSON strings. Can be used to confirm that an object is serializable
 */
type Json =
  | null
  | boolean
  | number
  | string
  | Json[]
  | { [prop: string]: Json };

/**
 * Extends a generic type to ensure that it is JSON serializable.
 * Checks that each key of an object is either valid JSON or is null.
 * Optional propeties of T become required, and can be set to null
 */
type JsonCompatible<T> = {
  [P in keyof T]: T[P] extends Json
    ? T[P]
    : Pick<T, P> extends Required<Pick<T, P>>
    ? never
    : JsonCompatible<T[P]>;
};
/**
 * Takes an interface T and changes all optional properties to required, allowing for them to be null.
 * Potentially useful for making a DTO from an interface without the need for repeating properties.
 */
type Complete<T> = {
  [P in keyof Required<T>]: Pick<T, P> extends Required<Pick<T, P>>
    ? T[P]
    : T[P] | undefined;
};

/**
 * An object that can be created from a JSON representation and has a serialize method to return its JSON representation
 *
 */
interface JsonSerializable<T> {
  new (data: JsonCompatible<T>);
  serialize(): JsonCompatible<T>;
}

export { Json, JsonCompatible, JsonSerializable, Complete };
