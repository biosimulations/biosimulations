import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DebugViewerComponent } from './viewer/viewer.component';
export { DebugViewerComponent } from './viewer/viewer.component';

const declarations = [DebugViewerComponent];
@NgModule({
  imports: [CommonModule],
  declarations: [...declarations],
  exports: [...declarations],
})
export class UiDebugModule {}
