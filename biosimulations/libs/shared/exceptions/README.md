# Exceptions

Exception handling for HTTP applications

## Filters

This library contains exception filters for NestJS applications. Each exception filter is added to the providers array of the [SharedExceptionsModule](./src/lib/shared-exceptions.module.ts). Importing the module to the App Module includes the filters. The filters set the Response body to [JSON-API Error Object](https://jsonapi.org/format/#error-objects)

## Exception Classes

The library also contains exception classes that are based on the [JSON-API Error Object](https://jsonapi.org/format/#error-objects) structure. The exception classes can be extended to pre-populate fields.

## Services

Currently, the filters are using the [HTTP Context](https://docs.nestjs.com/fundamentals/execution-context#execution-context). This should be abstracting using the [Execution Context](https://docs.nestjs.com/fundamentals/execution-context#current-application-context) to allow the same filters to work with services.

## Running unit tests

Run `ng test shared-exceptions` to exe cute the unit tests via [Jest](https://jestjs.io).
