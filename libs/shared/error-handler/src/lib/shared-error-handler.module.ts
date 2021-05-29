import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorHandler as BiosimulationsErrorHandler } from './error-handler';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [],
  providers: [{ provide: ErrorHandler, useClass: BiosimulationsErrorHandler }],
})
export class SharedErrorHandlerModule {}
