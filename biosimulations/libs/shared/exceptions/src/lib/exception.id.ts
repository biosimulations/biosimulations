import { HttpStatus } from '@nestjs/common';

import { StrictModeError } from './filters/Mongo/strict-mode-exception';

// use this as a list of all the  errors that are defined/caught. This will provide the source of information for creating the error responses.
const errors = {
  StrictModeError: {
    id: 1,
    title: 'Extra Fields Error',
    detail: 'The input object contains fields that are not in the schema',
    status: HttpStatus.BAD_REQUEST
  },
  KeyConflictError: {
    id: 2,
    title: 'Key Conflict',
    detail: 'The value for a unique key is already present in the database',
    status: HttpStatus.CONFLICT
  }
};
