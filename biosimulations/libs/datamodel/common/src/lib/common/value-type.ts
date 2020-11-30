// TODO Decide if API needs to be sent the key or the value of the enum. Make sure this is consistent across codebase.
/* When using the enum to populate the open api spec, the values are selected as the valid type. For database models, using Object.keys(Ontologies) will give keys, but Object.keys(enum).map(
      (k) => enum[k as enum] will give values. The database entries can be set to the keys for consistency. Then the API needs to make sure to map the value back to its key. Alternatively, we can make sure that the key/values stay consistent.
*/
export enum ValueType {
  boolean = 'boolean',
  integer = 'integer',
  float = 'float',
  string = 'string',
  kisaoId = 'kisaoId',
  list = 'list',
  object = 'object',
  any = 'any',
}
