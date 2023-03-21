import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { ClipboardService } from './clipboard/clipboard.service';
@NgModule({
  imports: [CommonModule, MatSnackBarModule],
  exports: [],
  declarations: [],
  providers: [ClipboardService],
})
export class SharedAngularModule {}
