import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisualizeLandingComponent } from './visualize-landing/visualize-landing.component';
import { VisualizeRoutingModule } from './visualize-routing.module';

@NgModule({
  declarations: [VisualizeLandingComponent],
  imports: [CommonModule, VisualizeRoutingModule],
  exports: [VisualizeLandingComponent],
})
export class VisualizeModule {}
