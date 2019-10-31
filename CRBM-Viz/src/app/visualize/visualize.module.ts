import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisualizeLandingComponent } from './visualize-landing/visualize-landing.component';

@NgModule({
  declarations: [VisualizeLandingComponent],
  imports: [CommonModule],
  exports: [VisualizeLandingComponent],
})
export class VisualizeModule {}
