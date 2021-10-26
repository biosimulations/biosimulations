import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ErrorHandler as BiosimulationsErrorHandler } from './error-handler';

@NgModule({
  declarations: [],
  imports: [CommonModule, MatDialogModule],
  exports: [],
  providers: [
    { provide: ErrorHandler, useClass: BiosimulationsErrorHandler },
    MatDialog,
  ],
})
export class SharedErrorHandlerModule {}
