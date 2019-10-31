import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisualizeRoutingModule } from './visualize-routing.module';
import { VisualizeComponent } from './visualize/visualize.component';
import { VegaViewerComponent } from './vega-viewer/vega-viewer.component';
import { LayoutModule } from '../Layout/layout.module';

@NgModule({
  declarations: [VisualizeComponent, VegaViewerComponent],
  imports: [CommonModule, VisualizeRoutingModule, LayoutModule],
  exports: [],
})
export class VisualizeModule {}
