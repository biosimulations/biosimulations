import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatLegacyDialogModule as MatDialogModule,
  MatLegacyDialog as MatDialog,
} from '@angular/material/legacy-dialog';
import { ErrorHandler as BiosimulationsErrorHandler } from './error-handler';

@NgModule({
  declarations: [],
  imports: [CommonModule, MatDialogModule],
  exports: [],
  providers: [{ provide: ErrorHandler, useClass: BiosimulationsErrorHandler }, MatDialog],
})
export class SharedErrorHandlerModule {}
