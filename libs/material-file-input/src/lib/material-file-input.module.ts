import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileInputComponent, ByteFormatPipe } from '../index';
import { FocusMonitor } from '@angular/cdk/a11y';

@NgModule({
  imports: [CommonModule],
  declarations: [FileInputComponent, ByteFormatPipe],
  providers: [FocusMonitor],
  exports: [FileInputComponent, ByteFormatPipe],
})
export class MaterialFileInputModule {}
