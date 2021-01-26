import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewerComponent } from './viewer/viewer.component';
import { RouterModule, Router } from '@angular/router';

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [ViewerComponent],
  exports: [ViewerComponent, RouterModule],
})
export class SharedDebugModule {}
