import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FocusMonitor } from '@angular/cdk/a11y';
import { ByteFormatPipe } from './pipe/byte-format.pipe';
import { FileInputComponent } from './file-input/file-input.component';

@NgModule({
  imports: [CommonModule],
  declarations: [FileInputComponent, ByteFormatPipe],
  providers: [FocusMonitor],
  exports: [FileInputComponent, ByteFormatPipe],
})
export class MaterialFileInputModule {}
