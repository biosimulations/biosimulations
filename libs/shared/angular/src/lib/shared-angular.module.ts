import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ClipboardService } from './clipboard/clipboard.service';
@NgModule({
  imports: [CommonModule, MatSnackBarModule],
  exports: [],
  declarations: [],
  providers: [ClipboardService],
})
export class SharedAngularModule {}
